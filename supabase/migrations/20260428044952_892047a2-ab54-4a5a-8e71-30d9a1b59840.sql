
-- ============ SERVICES ============
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  price NUMERIC NOT NULL DEFAULT 0,
  pricing_type TEXT NOT NULL DEFAULT 'fixed', -- fixed | hourly
  experience_level TEXT DEFAULT 'Beginner',
  availability TEXT,
  state TEXT,
  city TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view active services" ON public.services FOR SELECT USING (is_active = true OR auth.uid() = seller_id);
CREATE POLICY "Sellers insert services" ON public.services FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers update services" ON public.services FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers delete services" ON public.services FOR DELETE USING (auth.uid() = seller_id);
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ BOOKINGS ============
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  total_price NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed | completed | cancelled
  phone TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Participants view bookings" ON public.bookings FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Sellers update bookings" ON public.bookings FOR UPDATE USING (auth.uid() = seller_id OR auth.uid() = buyer_id);
CREATE POLICY "Admins view all bookings" ON public.bookings FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ REVIEWS ============
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  target_type TEXT NOT NULL, -- 'product' | 'service'
  target_id UUID NOT NULL,
  order_id UUID, -- products
  booking_id UUID, -- services
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  is_reported BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Validation function: only delivered orders / completed bookings, owned by user
CREATE OR REPLACE FUNCTION public.validate_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.target_type = 'product' THEN
    IF NEW.order_id IS NULL THEN
      RAISE EXCEPTION 'order_id required for product review';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = NEW.order_id
        AND buyer_id = NEW.user_id
        AND product_id = NEW.target_id
        AND status = 'delivered'
    ) THEN
      RAISE EXCEPTION 'You can only review products from delivered orders';
    END IF;
  ELSIF NEW.target_type = 'service' THEN
    IF NEW.booking_id IS NULL THEN
      RAISE EXCEPTION 'booking_id required for service review';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = NEW.booking_id
        AND buyer_id = NEW.user_id
        AND service_id = NEW.target_id
        AND status = 'completed'
    ) THEN
      RAISE EXCEPTION 'You can only review services from completed bookings';
    END IF;
  ELSE
    RAISE EXCEPTION 'Invalid target_type';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_validate_review BEFORE INSERT ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.validate_review();
CREATE TRIGGER trg_reviews_updated BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Anyone view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Verified buyers create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_reviews_target ON public.reviews(target_type, target_id);

-- ============ WISHLISTS ============
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  target_type TEXT NOT NULL, -- product | service
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, target_type, target_id)
);
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own wishlist" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users add wishlist" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove wishlist" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- ============ CONVERSATIONS + MESSAGES ============
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  product_id UUID,
  service_id UUID,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(buyer_id, seller_id, product_id, service_id)
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants view conversations" ON public.conversations FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Buyers create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Participants update conversations" ON public.conversations FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_conversation_participant(_conv_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversations
    WHERE id = _conv_id AND (buyer_id = _user_id OR seller_id = _user_id)
  )
$$;

CREATE POLICY "Participants view messages" ON public.messages FOR SELECT USING (public.is_conversation_participant(conversation_id, auth.uid()));
CREATE POLICY "Participants send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id AND public.is_conversation_participant(conversation_id, auth.uid()));
CREATE POLICY "Participants update messages" ON public.messages FOR UPDATE USING (public.is_conversation_participant(conversation_id, auth.uid()));

CREATE INDEX idx_messages_conv ON public.messages(conversation_id, created_at);

-- ============ PRODUCT ENHANCEMENTS ============
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}'::text[];

-- ============ STORAGE BUCKET ============
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Sellers upload own product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Sellers update own product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Sellers delete own product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============ REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
