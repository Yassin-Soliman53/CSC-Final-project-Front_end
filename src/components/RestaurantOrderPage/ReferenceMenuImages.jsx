import shakshakPizzaMenu from "../../assets/images/WhatsApp Image 2026-10-26 at 19.53.52.jpeg";
import shakshakPiesMenu from "../../assets/images/WhatsApp Image 2026-10-26 at 19.53.54.jpeg";

const referenceMenus = [
  { src: shakshakPizzaMenu, title: "منيو البيتزا والفطائر" },
  { src: shakshakPiesMenu, title: "منيو الفطائر والمكرونات" },
];

export default function ReferenceMenuImages() {
  return (
    <section className="mt-6 space-y-4 rounded-2xl border-2 border-[#737373]/30 bg-white/90 p-4 shadow-sm sm:p-5">
      <div>
        <h2 className="text-xl font-black text-[#1a1a1a]">
          صور المنيو المرجعية
        </h2>
        <p className="mt-1 text-sm text-[#737373]">
          الصور الأصلية للمراجعة بجانب قائمة الأصناف المكتوبة.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {referenceMenus.map((menu) => (
          <figure
            key={menu.src}
            className="overflow-hidden rounded-xl border border-[#737373]/30 bg-[#FFF4E6]"
          >
            <figcaption className="border-b border-[#737373]/20 px-4 py-2 font-bold text-[#1a1a1a]">
              {menu.title}
            </figcaption>
            <a href={menu.src} target="_blank" rel="noreferrer">
              <img
                src={menu.src}
                alt={menu.title}
                className="h-auto max-h-[620px] w-full object-contain"
                loading="lazy"
              />
            </a>
          </figure>
        ))}
      </div>
    </section>
  );
}
