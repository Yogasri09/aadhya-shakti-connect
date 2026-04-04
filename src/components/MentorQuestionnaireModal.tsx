import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { MENTOR_QUESTIONNAIRE_OPTIONS, type MentorQuestionnaireAnswers } from "@/data/locationData";
import { ChevronRight, ChevronLeft, Sparkles, GraduationCap, Heart, Globe } from "lucide-react";
import { toast } from "sonner";

const TOTAL_STEPS = 3;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MentorQuestionnaireModal({ open, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [answers, setAnswers] = useState<MentorQuestionnaireAnswers>({
    languagesKnown: [],
  });

  const setAnswer = (key: keyof MentorQuestionnaireAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const toggleLanguage = (lang: string) => {
    setAnswers(prev => {
      const current = prev.languagesKnown || [];
      return {
        ...prev,
        languagesKnown: current.includes(lang)
          ? current.filter(l => l !== lang)
          : [...current, lang],
      };
    });
  };

  const progress = (step / TOTAL_STEPS) * 100;

  const handleSubmit = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(r => setTimeout(r, 800));
    toast.success("Mentor profile setup complete! Your dashboard is now personalized.");
    setSaving(false);
    onClose();
  };

  const canProceed = () => {
    if (step === 1) return !!answers.expertiseArea;
    return true;
  };

  const stepIcons = [GraduationCap, Heart, Globe];
  const stepTitles = [
    "Expertise & Experience",
    "Mentoring Preferences",
    "Availability & Reach",
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
              <DialogTitle className="font-serif text-lg">Mentor Profile Setup</DialogTitle>
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
                {/* Q1: Expertise Area */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" /> Your expertise area *
                  </Label>
                  <RadioGroup value={answers.expertiseArea || ""} onValueChange={v => setAnswer("expertiseArea", v)} className="grid grid-cols-2 gap-2">
                    {MENTOR_QUESTIONNAIRE_OPTIONS.expertiseArea.map(opt => (
                      <label key={opt} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.expertiseArea === opt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q2: Years of Experience */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Years of experience</Label>
                  <RadioGroup value={answers.yearsOfExperience || ""} onValueChange={v => setAnswer("yearsOfExperience", v)} className="flex gap-2">
                    {MENTOR_QUESTIONNAIRE_OPTIONS.yearsOfExperience.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.yearsOfExperience === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q3: Mentoring Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Preferred mentoring type</Label>
                  <RadioGroup value={answers.mentoringType || ""} onValueChange={v => setAnswer("mentoringType", v)} className="grid gap-2">
                    {MENTOR_QUESTIONNAIRE_OPTIONS.mentoringType.map(opt => (
                      <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers.mentoringType === opt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q4: Availability */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Availability (hours/week)</Label>
                  <RadioGroup value={answers.availability || ""} onValueChange={v => setAnswer("availability", v)} className="grid grid-cols-2 gap-2">
                    {MENTOR_QUESTIONNAIRE_OPTIONS.availability.map(opt => (
                      <label key={opt} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.availability === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
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
                {/* Q5: Preferred Audience */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Preferred audience level</Label>
                  <RadioGroup value={answers.preferredAudience || ""} onValueChange={v => setAnswer("preferredAudience", v)} className="flex gap-2">
                    {MENTOR_QUESTIONNAIRE_OPTIONS.preferredAudience.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.preferredAudience === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q6: Online/Offline */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Mentoring mode</Label>
                  <RadioGroup value={answers.mentoringMode || ""} onValueChange={v => setAnswer("mentoringMode", v)} className="grid gap-2">
                    {MENTOR_QUESTIONNAIRE_OPTIONS.mentoringMode.map(opt => (
                      <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers.mentoringMode === opt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q7: Languages (multi) */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" /> Languages known
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {MENTOR_QUESTIONNAIRE_OPTIONS.languagesKnown.map(lang => (
                      <label key={lang} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.languagesKnown?.includes(lang) ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <Checkbox checked={answers.languagesKnown?.includes(lang)} onCheckedChange={() => toggleLanguage(lang)} />
                        {lang}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q8: Group Mentoring */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Comfortable with group mentoring?</Label>
                  <RadioGroup value={answers.groupMentoring || ""} onValueChange={v => setAnswer("groupMentoring", v)} className="flex gap-2">
                    {MENTOR_QUESTIONNAIRE_OPTIONS.groupMentoring.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.groupMentoring === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
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
                {/* Q9: Paid Mentoring */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Interested in paid mentoring?</Label>
                  <RadioGroup value={answers.paidMentoring || ""} onValueChange={v => setAnswer("paidMentoring", v)} className="grid gap-2">
                    {MENTOR_QUESTIONNAIRE_OPTIONS.paidMentoring.map(opt => (
                      <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers.paidMentoring === opt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q10: Domain Demand Awareness */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Are you aware of domain demand in your area?</Label>
                  <RadioGroup value={answers.domainDemandAwareness || ""} onValueChange={v => setAnswer("domainDemandAwareness", v)} className="flex gap-2">
                    {MENTOR_QUESTIONNAIRE_OPTIONS.domainDemandAwareness.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.domainDemandAwareness === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q11: Willing to Travel */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Willing to travel for mentoring?</Label>
                  <RadioGroup value={answers.willingToTravel || ""} onValueChange={v => setAnswer("willingToTravel", v)} className="flex gap-2">
                    {MENTOR_QUESTIONNAIRE_OPTIONS.willingToTravel.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.willingToTravel === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
                        <RadioGroupItem value={opt} className="sr-only" />
                        {opt}
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Q12: Certifications */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Do you hold relevant certifications?</Label>
                  <RadioGroup value={answers.certificationsHeld || ""} onValueChange={v => setAnswer("certificationsHeld", v)} className="flex gap-2">
                    {MENTOR_QUESTIONNAIRE_OPTIONS.certificationsHeld.map(opt => (
                      <label key={opt} className={`flex-1 text-center p-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${answers.certificationsHeld === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"}`}>
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
