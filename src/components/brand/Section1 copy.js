import Image from 'next/image'

export default function Section1 () {
  return <div className="h-screen container mx-auto flex flex-col justify-center items-center
    gap-5
    md:gap-8
    lg:gap-9
    xl:gap-10
  ">
    <Image className="h-auto
      w-full
      md:w-[300px]
      lg:w-[400px]
      xl:w-[438px]
    " src="/images/coming_soon.png" alt="logo" width={438} height={380} />
    <h1 className="font-semibold text-center flex gap-3 uppercase
      text-2xl
      md:text-3xl
      lg:text-[36px]
      xl:text-[40px]
    ">
      <span className="text-[#D9D9D9]">Coming</span>
      <span className="text-[#FFC90F]">Soon</span>
    </h1>
  </div>
}
