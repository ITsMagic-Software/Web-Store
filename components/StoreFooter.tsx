import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import { withBasePath } from "@/lib/paths";

interface StoreFooterProps {
  locale: Locale;
}

const links = {
  download: "https://play.google.com/store/apps/details?id=com.itsmagic.engine2",
  discord: "https://discord.gg/cjN7uUTUEr",
  youtubeEnglish: "https://www.youtube.com/c/ITsMagicWeMadeTheImpossible",
  youtubePortuguese: "https://www.youtube.com/c/TheFuzeITsMagic",
  documentation: "https://itsmagic.com.br/documentation/",
} as const;

const linkClassName = "inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground";

export function StoreFooter({ locale }: StoreFooterProps) {
  const messages = getDictionary(locale);

  return (
    <footer className="border-t border-divider px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-x-10 gap-y-8 sm:grid-cols-[minmax(0,1fr)_auto_auto] lg:gap-x-16">
        <div className="space-y-2">
          <a href={withBasePath(`/${locale === "pt-BR" ? "pt-br" : "en"}`)} className="flex min-h-11 shrink-0 items-center gap-2.5 text-sm font-semibold tracking-tight text-foreground">
            <Image src="/store/itsmagic-logo.png" alt="" width={34} height={34} priority className="size-8" />
            <span>{messages.brandDisplay}</span>
          </a>
          
          <p className="text-xs text-muted-foreground">{messages.footerCopyright}</p>
        </div>

        <nav aria-label={messages.footerProductLinks}>
          <h2 className="text-sm font-medium text-foreground">{messages.footerProductLinks}</h2>
          <ul className="mt-2">
            <li><a href={links.download} target="_blank" rel="noopener noreferrer" className={linkClassName}>{messages.downloadITsMagic}</a></li>
            <li><a href={links.documentation} target="_blank" rel="noopener noreferrer" className={linkClassName}>{messages.documentationLink}</a></li>
          </ul>
        </nav>

        <nav aria-label={messages.communityLink}>
          <h2 className="text-sm font-medium text-foreground">{messages.communityLink}</h2>
          <ul className="mt-2">
            <li><a href={links.discord} target="_blank" rel="noopener noreferrer" className={linkClassName}>Discord</a></li>
            <li><a href={links.youtubeEnglish} target="_blank" rel="noopener noreferrer" className={linkClassName}>{messages.youtubeEnglish}</a></li>
            <li><a href={links.youtubePortuguese} target="_blank" rel="noopener noreferrer" className={linkClassName}>{messages.youtubePortuguese}</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
