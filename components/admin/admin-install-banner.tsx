'use client';

import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DISMISS_KEY = 'movteens-install-dismissed';
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  const nav = navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIos = /iPhone|iPad|iPod/i.test(ua);
  const isSafari =
    /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
  return isIos && isSafari;
}

function isDismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (Number.isNaN(ts)) return false;
    return Date.now() - ts < DISMISS_MS;
  } catch {
    return false;
  }
}

function shouldShowBanner(deferredPrompt: BeforeInstallPromptEvent | null): boolean {
  if (isStandalone() || isDismissedRecently()) return false;
  if (deferredPrompt) return true;
  return isIosSafari();
}

export function AdminInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(true);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    setHidden(!shouldShowBanner(deferredPrompt));
  }, [deferredPrompt]);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferredPrompt(null);
      setHidden(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
    setHidden(true);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setHidden(true);
    } catch {
      // user cancelled or browser blocked
    } finally {
      setInstalling(false);
    }
  };

  if (hidden) return null;

  const android = Boolean(deferredPrompt);

  return (
    <div
      role="region"
      aria-label="Instalar aplicativo"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm',
        'pb-[max(0.75rem,env(safe-area-inset-bottom))] px-4 pt-3 shadow-lg',
      )}
    >
      <div className="relative mx-auto flex max-w-lg flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 pr-8 sm:pr-0">
          <p className="text-sm font-semibold text-foreground">
            {android ? 'Instalar MovTeens Admin' : 'Atalho na tela inicial'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
            {android ? (
              'Abra o painel com um toque, como um aplicativo.'
            ) : (
              <>
                Toque em{' '}
                <Share className="inline size-3.5 align-text-bottom mx-0.5" />{' '}
                Compartilhar e depois em{' '}
                <span className="font-medium text-foreground">
                  Adicionar à Tela de Início
                </span>
                .
              </>
            )}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {android ? (
            <Button
              type="button"
              size="sm"
              className="cursor-pointer min-h-10 flex-1 sm:flex-none"
              disabled={installing}
              onClick={() => void handleInstall()}
            >
              <Download className="size-4" />
              Instalar
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer min-h-10"
            onClick={handleDismiss}
          >
            Agora não
          </Button>
        </div>
        <button
          type="button"
          className="absolute top-0 right-0 p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer sm:hidden"
          aria-label="Fechar"
          onClick={handleDismiss}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
