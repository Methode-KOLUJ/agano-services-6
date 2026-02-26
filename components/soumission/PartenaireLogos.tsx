import Marquee from "react-fast-marquee";
import logos from "./Logos.json";

export default function PartenaireLogos() {
    return (
        <section className="w-full bg-white py-10 overflow-hidden">
            <p className="mb-6 md:mb-12 text-center text-sm md:text-base lg:text-lg font-semibold text-gray-500">
                Ils nous font confiance
            </p>

            <Marquee
                speed={20}
                gradient
                pauseOnHover
            >
                {logos.map((logo, index) => (
                    <div key={index} className="mx-6 md:mx-12 flex items-center">
                        <img
                            src={logo.url}
                            alt={logo.name}
                            loading="lazy"
                            className="
                h-10 md:h-12 lg:h-16
                object-contain
                lg:grayscale
                opacity-70
                transition-all
                duration-300
                hover:grayscale-0
                hover:opacity-100
                select-none
              "
                        />
                    </div>
                ))}
            </Marquee>
        </section>
    );
}
