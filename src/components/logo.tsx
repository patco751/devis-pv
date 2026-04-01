import Image from "next/image";

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/icon-192.png"
      alt="DevisPV"
      width={size}
      height={size}
      className="rounded-lg"
    />
  );
}

export function LogoWithText({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <Logo size={size} />
      <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
        Devis<span className="text-primary">PV</span>
      </span>
    </div>
  );
}
