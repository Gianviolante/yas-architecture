export const metadata = {
  title: "Privacy Policy — YAS Architecture",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-[60px] md:pt-[80px]">
      <div className="page-px py-[40px] md:py-[60px]">
        <h1 className="text-[36px] md:text-[48px] font-bold leading-[1.3] text-black mb-[40px]">
          Privacy Policy
        </h1>

        <div className="max-w-[798px] text-[16px] md:text-[17.5px] leading-[1.6] text-black space-y-6">
          <p>
            Questa è la nostra informativa sulla privacy. Per informazioni dettagliate, contattaci a{" "}
            <a href="mailto:studio@yas-arc.com" className="underline hover:opacity-60">
              studio@yas-arc.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
