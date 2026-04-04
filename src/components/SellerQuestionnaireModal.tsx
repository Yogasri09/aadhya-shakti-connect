import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { SELLER_QUESTIONNAIRE_OPTIONS, type SellerQuestionnaireAnswers } from "@/data/locationData";
import { ChevronRight, ChevronLeft, Sparkles, ShoppingBag, Target, Truck } from "lucide-react";
import { toast } from "sonner";

const TOTAL_STEPS = 3;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SellerQuestionnaireModal({ open, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [answers, setAnswers] = useState<SellerQuestionnaireAnswers>({});

  const setAnswer = (key: keyof SellerQuestionnaireAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const progress = (step / TOTAL_STEPS) * 100;

  const handleSubmit = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success("Seller profile setup complete! Your dashboard is now personalized.");
    setSaving(false);
    onClose();
  };

  const canProceed = () => {
    if (step === 1) return !!answers.businessType;
    return true;
  };

  const stepTitles = [
    "Business Basics",
    "Capacity & Pricing",
    "Delivery & Growth",
  ];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto [&>button]:hidden" onPointerDownOutside={e => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl hero-gradient flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="font-serif text-lg">Seller Profile Setup</DialogTitle>
              <DialogDescription className="text-xs">Step {step} of {TOTAL_STEPS} — {stepTitles[step - 1]}</DialogDescription>
            </div>
          </div>
          <Progress value={progress} className="h-1.5 mt-2" />
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-5 py-2"
          >
            {step === 1 && (
              <>
                {/* Q1: Business Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-primary" /> Type of business *
                  </Label>
                  <RadioGroup value={answers.businessType || ""} onValueChange={v => setAnswer("businessType", v)} className="grid grid-cols-2 gap-2">
                    {SELLER_QUESTIONNAIRE_OPTIONS.businessType.map(opt => (
                      <label key={opt} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.businessType === opt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q2: Product Category */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Product category</Label>
                  <RadioGroup value={answers.productCategory || ""} onValueChange={v => setAnswer("productCategory", v)} className="grid grid-cols-2 gap-2">
                    {SELLER_QUESTIONNAIRE_OPTIONS.productCategory.map(opt => (
                      <label key={opt} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.productCategory === opt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q3: Experience Level */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Experience level</Label>
                  <RadioGroup value={answers.experienceLevel || ""} onValueChange={v => setAnswer("experienceLevel", v)} className="grid grid-cols-2 gap-2">
                    {SELLER_QUESTIONNAIRE_OPTIONS.experienceLevel.map(opt => (
                      <label key={opt} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.experienceLevel === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q4: Monthly Capacity */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Monthly production capacity</Label>
                  <RadioGroup value={answers.monthlyCapacity || ""} onValueChange={v => setAnswer("monthlyCapacity", v)} className="flex gap-2">
                    {SELLER_QUESTIONNAIRE_OPTIONS.monthlyCapacity.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-xs ${answers.monthlyCapacity === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* Q5: Pricing Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" /> Pricing range
                  </Label>
                  <RadioGroup value={answers.pricingRange || ""} onValueChange={v => setAnswer("pricingRange", v)} className="grid gap-2">
                    {SELLER_QUESTIONNAIRE_OPTIONS.pricingRange.map(opt => (
                      <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers.pricingRange === opt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q6: Target Audience */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Target audience</Label>
                  <RadioGroup value={answers.targetAudience || ""} onValueChange={v => setAnswer("targetAudience", v)} className="flex gap-2">
                    {SELLER_QUESTIONNAIRE_OPTIONS.targetAudience.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-xs ${answers.targetAudience === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q7: Online Selling Experience */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Online selling experience</Label>
                  <RadioGroup value={answers.onlineSellingExperience || ""} onValueChange={v => setAnswer("onlineSellingExperience", v)} className="grid grid-cols-2 gap-2">
                    {SELLER_QUESTIONNAIRE_OPTIONS.onlineSellingExperience.map(opt => (
                      <label key={opt} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.onlineSellingExperience === opt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q8: Interested in Training */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Interested in business training?</Label>
                  <RadioGroup value={answers.interestedInTraining || ""} onValueChange={v => setAnswer("interestedInTraining", v)} className="flex gap-2">
                    {SELLER_QUESTIONNAIRE_OPTIONS.interestedInTraining.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.interestedInTraining === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                {/* Q9: Delivery Capability */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" /> Delivery capability
                  </Label>
                  <RadioGroup value={answers.deliveryCapability || ""} onValueChange={v => setAnswer("deliveryCapability", v)} className="grid grid-cols-2 gap-2">
                    {SELLER_QUESTIONNAIRE_OPTIONS.deliveryCapability.map(opt => (
                      <label key={opt} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.deliveryCapability === opt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q10: Preferred Language */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Preferred language</Label>
                  <RadioGroup value={answers.preferredLanguage || ""} onValueChange={v => setAnswer("preferredLanguage", v)} className="grid grid-cols-3 gap-2">
                    {SELLER_QUESTIONNAIRE_OPTIONS.preferredLanguage.map(opt => (
                      <label key={opt} className={`text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.preferredLanguage === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q11: Marketplace Interest */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">List on Aadhya Marketplace?</Label>
                  <RadioGroup value={answers.marketplaceInterest || ""} onValueChange={v => setAnswer("marketplaceInterest", v)} className="grid gap-2">
                    {SELLER_QUESTIONNAIRE_OPTIONS.marketplaceInterest.map(opt => (
                      <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers.marketplaceInterest === opt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q12: Need Financial Help */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Need financial assistance or loans?</Label>
                  <RadioGroup value={answers.needFinancialHelp || ""} onValueChange={v => setAnswer("needFinancialHelp", v)} className="flex gap-2">
                    {SELLER_QUESTIONNAIRE_OPTIONS.needFinancialHelp.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.needFinancialHelp === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between pt-2 border-t">
          <Button variant="ghost" size="sm" disabled={step === 1} onClick={() => setStep(s => s - 1)}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i < step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          {step < TOTAL_STEPS ? (
            <Button size="sm" onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button size="sm" onClick={handleSubmit} disabled={saving} className="hero-gradient text-primary-foreground">
              {saving ? "Saving..." : "Complete Setup"} <Sparkles className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
