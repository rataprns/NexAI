
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useScopedI18n } from "@/locales/client";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChannelsGuideDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChannelsGuideDialog({ isOpen, onOpenChange }: ChannelsGuideDialogProps) {
  const t = useScopedI18n("channels");

  const Step = ({ number, text }: { number: number, text: string }) => (
    <div className="flex items-start gap-4">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
        {number}
      </div>
      <p className="flex-1 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("guide-title")}</DialogTitle>
          <DialogDescription>{t("guide-description")}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-6">
            <div className="space-y-6 py-4">
                {/* General Steps */}
                <div>
                    <h3 className="font-semibold mb-4">{t('guide-general-steps-title')}</h3>
                    <div className="space-y-3">
                        <Step number={1} text={t('guide-step-1')} />
                        <Step number={2} text={t('guide-step-2')} />
                        <Step number={3} text={t('guide-step-3')} />
                    </div>
                </div>

                <Separator />

                {/* WhatsApp */}
                <div>
                    <h3 className="font-semibold mb-4">{t('guide-whatsapp-title')}</h3>
                    <div className="space-y-3">
                        <Step number={1} text={t('guide-whatsapp-step-1')} />
                        <Step number={2} text={t('guide-whatsapp-step-2')} />
                        <Step number={3} text={t('guide-whatsapp-step-3')} />
                    </div>
                </div>

                <Separator />

                {/* Messenger */}
                <div>
                    <h3 className="font-semibold mb-4">{t('guide-messenger-title')}</h3>
                    <div className="space-y-3">
                        <Step number={1} text={t('guide-messenger-step-1')} />
                        <Step number={2} text={t('guide-messenger-step-2')} />
                        <Step number={3} text={t('guide-messenger-step-3')} />
                    </div>
                </div>

                <Separator />

                {/* App Secret */}
                <div>
                    <h3 className="font-semibold mb-4">{t('guide-secrets-title')}</h3>
                    <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('guide-secrets-description')}} />
                </div>
            </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>{t('guide-close-button')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
