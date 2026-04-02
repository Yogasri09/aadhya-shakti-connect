import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { QUESTIONNAIRE_OPTIONS, type QuestionnaireAnswers } from "@/data/locationData";
import { ChevronRight, ChevronLeft, Sparkles, Target, BookOpen, Briefcase, Heart } from "lucide-react";
import { toast } from "sonner";

const TOTAL_STEPS = 3;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function QuestionnaireModal({ open, onClose }: Props) {
  const { completeQuestionnaire } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    interests: [],
  });

  const setAnswer = (key: keyof QuestionnaireAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const toggleInterest = (interest: string) => {
    setAnswers(prev => {
      const current = prev.interests || [];
      return {
        ...prev,
        interests: current.includes(interest)
          ? current.filter(i => i !== interest)
          : [...current, interest],
      };
    });
  };

  const progress = (step / TOTAL_STEPS) * 100;

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await completeQuestionnaire(answers);
      toast.success("Profile setup complete! Your dashboard is now personalized.");
      onClose();
    } catch {
      toast.error("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  const canProceed = () => {
    if (step === 1) return !!answers.primaryGoal;
    if (step === 2) return true;
    return true;
  };

  const stepIcons = [Target, BookOpen, Briefcase];
  const stepTitles = [
    "Your Goals & Interests",
    "Preferences & Support",
    "Business & Motivation",
  ];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto [&>button]:hidden" onPointerDownOutside={e => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl hero-gradient flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="font-serif text-lg">Let's Personalize Your Experience</DialogTitle>
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
                {/* Q1: Primary Goal */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    What is your primary goal? *
                  </Label>
                  <RadioGroup value={answers.primaryGoal || ""} onValueChange={v => setAnswer("primaryGoal", v)} className="grid gap-2">
                    {QUESTIONNAIRE_OPTIONS.primaryGoal.map(opt => (
                      <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers.primaryGoal === opt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q2: Interests (multi-select) */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    Areas of interest (select all that apply)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {QUESTIONNAIRE_OPTIONS.interests.map(opt => (
                      <label key={opt} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.interests?.includes(opt) ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <Checkbox checked={answers.interests?.includes(opt)} onCheckedChange={() => toggleInterest(opt)} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q3: Skill Level */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Skill Level</Label>
                  <RadioGroup value={answers.skillLevel || ""} onValueChange={v => setAnswer("skillLevel", v)} className="flex gap-2">
                    {QUESTIONNAIRE_OPTIONS.skillLevel.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.skillLevel === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q4: Learning Mode */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Preferred Learning Mode</Label>
                  <RadioGroup value={answers.learningMode || ""} onValueChange={v => setAnswer("learningMode", v)} className="flex gap-2">
                    {QUESTIONNAIRE_OPTIONS.learningMode.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.learningMode === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q5: Need Mentorship */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Do you need mentorship?</Label>
                  <RadioGroup value={answers.needMentorship || ""} onValueChange={v => setAnswer("needMentorship", v)} className="flex gap-2">
                    {QUESTIONNAIRE_OPTIONS.needMentorship.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.needMentorship === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
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
                {/* Q6: Mentorship Area */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Preferred mentorship area</Label>
                  <RadioGroup value={answers.mentorshipArea || ""} onValueChange={v => setAnswer("mentorshipArea", v)} className="grid gap-2">
                    {QUESTIONNAIRE_OPTIONS.mentorshipArea.map(opt => (
                      <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers.mentorshipArea === opt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q7: Gov Scheme Interest */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Interested in government schemes?</Label>
                  <RadioGroup value={answers.govSchemeInterest || ""} onValueChange={v => setAnswer("govSchemeInterest", v)} className="flex gap-2">
                    {QUESTIONNAIRE_OPTIONS.govSchemeInterest.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.govSchemeInterest === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q8: Budget */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Your budget for learning/business</Label>
                  <RadioGroup value={answers.budget || ""} onValueChange={v => setAnswer("budget", v)} className="grid gap-2">
                    {QUESTIONNAIRE_OPTIONS.budget.map(opt => (
                      <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers.budget === opt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q9: Weekly Time */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Weekly time available</Label>
                  <RadioGroup value={answers.weeklyTime || ""} onValueChange={v => setAnswer("weeklyTime", v)} className="grid gap-2">
                    {QUESTIONNAIRE_OPTIONS.weeklyTime.map(opt => (
                      <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers.weeklyTime === opt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q10: Interested in Selling */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Interested in selling products?</Label>
                  <RadioGroup value={answers.interestedInSelling || ""} onValueChange={v => setAnswer("interestedInSelling", v)} className="flex gap-2">
                    {QUESTIONNAIRE_OPTIONS.interestedInSelling.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.interestedInSelling === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
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
                {/* Q11: Business Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Type of business interest
                  </Label>
                  <RadioGroup value={answers.businessType || ""} onValueChange={v => setAnswer("businessType", v)} className="grid gap-2">
                    {QUESTIONNAIRE_OPTIONS.businessType.map(opt => (
                      <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers.businessType === opt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q12: Prefer Local */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Prefer local opportunities?</Label>
                  <RadioGroup value={answers.preferLocal || ""} onValueChange={v => setAnswer("preferLocal", v)} className="flex gap-2">
                    {QUESTIONNAIRE_OPTIONS.preferLocal.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.preferLocal === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q13: Motivation */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">What motivates you?</Label>
                  <RadioGroup value={answers.motivation || ""} onValueChange={v => setAnswer("motivation", v)} className="grid gap-2">
                    {QUESTIONNAIRE_OPTIONS.motivation.map(opt => (
                      <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers.motivation === opt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q14: Need Certification */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Do you need certification?</Label>
                  <RadioGroup value={answers.needCertification || ""} onValueChange={v => setAnswer("needCertification", v)} className="flex gap-2">
                    {QUESTIONNAIRE_OPTIONS.needCertification.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.needCertification === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q15: Language */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Preferred language</Label>
                  <RadioGroup value={answers.language || ""} onValueChange={v => setAnswer("language", v)} className="grid grid-cols-2 gap-2">
                    {QUESTIONNAIRE_OPTIONS.language.map(opt => (
                      <label key={opt} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.language === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
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
          <Button
            variant="ghost"
            size="sm"
            disabled={step === 1}
            onClick={() => setStep(s => s - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i < step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>

          {step < TOTAL_STEPS ? (
            <Button
              size="sm"
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={saving}
              className="hero-gradient text-primary-foreground"
            >
              {saving ? "Saving..." : "Complete Setup"} <Sparkles className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
