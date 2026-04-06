
-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Buyers can view their own orders
CREATE POLICY "Buyers can view own orders"
ON public.orders FOR SELECT
USING (auth.uid() = buyer_id);

-- Sellers can view orders for their products
CREATE POLICY "Sellers can view their orders"
ON public.orders FOR SELECT
USING (auth.uid() = seller_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Buyers can create orders
CREATE POLICY "Buyers can create orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

-- Sellers can update order status
CREATE POLICY "Sellers can update order status"
ON public.orders FOR UPDATE
USING (auth.uid() = seller_id);

-- Trigger for updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Also fix: allow authenticated users to insert notifications (needed for order notifications)
CREATE POLICY "Authenticated users can insert notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
