import { Lines, Fade, MediaFrame } from './Reveal';
import { Img } from './Img';

function Facts({ items }: { items: string[] }) {
  return (
    <ul className="mt-8 flex flex-col border-t border-white/15">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-4 border-b border-white/15 py-3.5 text-[13px] text-bone/85">
          <span className="h-1.5 w-1.5 bg-burnt" />
          {t}
        </li>
      ))}
    </ul>
  );
}

export function Engineering() {
  return (
    <section id="engineering" data-nav="engineering" className="relative overflow-hidden bg-graphite py-28 lg:py-40">
      {/* Intro */}
      <div className="mx-auto grid max-w-[1920px] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
        <Lines lines={['EVERY DETAIL', 'HAS A PURPOSE.']} className="t-display text-[clamp(2.4rem,6vw,7.4rem)] lg:col-span-9" />
        <Fade className="t-body lg:col-span-3 lg:self-end" delay={0.2}>
          <p>Three stories from the workshop: how the body moves air, how the hardware carries load, and how the cabin disappears around the driver.</p>
        </Fade>
      </div>

      {/* 01 — Aerodynamic form : image left, text right and lowered */}
      <div className="mx-auto mt-24 grid max-w-[1920px] items-start gap-8 px-5 sm:px-8 lg:mt-40 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <MediaFrame className="aspect-[4/3] bg-ink lg:col-span-8 lg:aspect-[16/10]" dir="right" parallax={8}>
          <Img name="rear" widths={[900, 1800]} ratio={1800 / 1005} sizes="(min-width:1024px) 66vw, 100vw" alt="Sculpted rear haunch and wheel arch of the black coupe" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: '70% 55%', transform: 'scale(1.35)', transformOrigin: '70% 55%' }} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
        </MediaFrame>
        <div className="lg:col-span-4 lg:mt-40">
          <div className="t-cond text-[clamp(5rem,9vw,9rem)] leading-[0.8] text-transparent" style={{ WebkitTextStroke: '1px rgba(236,232,224,0.4)' }}>01</div>
          <Lines lines={['AERODYNAMIC', 'FORM']} as="h3" className="t-display mt-4 text-[clamp(1.7rem,2.8vw,3.3rem)]" />
          <Fade className="t-body mt-5" delay={0.1}><p>The body is shaped by the air it moves through. A raised rear deck, sculpted flanks and an open diffuser work together to keep the car settled as speed builds.</p></Fade>
          <Facts items={['Raised rear deck and integrated spoiler', 'Sculpted flanks guiding air to the rear', 'Open diffuser beneath the tail']} />
        </div>
      </div>

      {/* 02 — Precision engineering : text left, tall image right, overlapping rhythm */}
      <div className="mx-auto mt-28 grid max-w-[1920px] items-end gap-8 px-5 sm:px-8 lg:mt-44 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="order-2 lg:order-1 lg:col-span-4 lg:pb-10">
          <div className="t-cond text-[clamp(5rem,9vw,9rem)] leading-[0.8] text-transparent" style={{ WebkitTextStroke: '1px rgba(236,232,224,0.4)' }}>02</div>
          <Lines lines={['PRECISION', 'ENGINEERING']} as="h3" className="t-display mt-4 text-[clamp(1.7rem,2.8vw,3.3rem)]" />
          <Fade className="t-body mt-5" delay={0.1}><p>Every component carries a load. Forged wheels cut unsprung mass, carbon-ceramic discs resist fade and a monobloc caliper keeps pedal feel consistent lap after lap.</p></Fade>
          <Facts items={['Forged lightweight wheels', 'Carbon-ceramic brake discs', 'Monobloc calipers in signature orange']} />
        </div>
        <MediaFrame className="order-1 aspect-[4/5] bg-ink sm:aspect-[5/4] lg:order-2 lg:col-span-7 lg:col-start-6 lg:aspect-[4/4.2]" dir="up" parallax={7}>
          <Img name="wheel" widths={[1000, 2000]} ratio={2000 / 1333} sizes="(min-width:1024px) 58vw, 100vw" alt="Close view of a forged black wheel, orange monobloc caliper and drilled carbon-ceramic disc" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: '45% 55%' }} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
        </MediaFrame>
      </div>

      {/* 03 — Driver-focused design : wide cinematic band with overlaid copy */}
      <div className="mt-28 lg:mt-44">
        <div className="relative">
          <MediaFrame className="aspect-[4/5] w-full bg-ink sm:aspect-[16/10] lg:aspect-[21/9]" dir="down" parallax={10}>
            <Img name="interior" widths={[1200, 2400]} ratio={3840 / 2560} sizes="100vw" alt="Cockpit with carbon-rimmed steering wheel, digital instruments and orange Alcantara trim" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: '50% 46%' }} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/25 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          </MediaFrame>
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1920px] px-5 pb-8 sm:px-8 lg:px-12 lg:pb-14">
            <div className="grid items-end gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="t-cond text-[clamp(4rem,7vw,7rem)] leading-[0.8] text-transparent" style={{ WebkitTextStroke: '1px rgba(236,232,224,0.55)' }}>03</div>
                <Lines lines={['DRIVER-FOCUSED', 'DESIGN']} as="h3" className="t-display mt-3 text-[clamp(1.7rem,2.8vw,3.3rem)]" />
              </div>
              <Fade className="t-body lg:col-span-4 lg:col-start-8" delay={0.1}>
                <p>The cockpit is built around the driver’s hands. A carbon-rimmed wheel, a digital instrument binnacle and Alcantara trim with contrast stitching, all within reach and out of the way.</p>
              </Fade>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
