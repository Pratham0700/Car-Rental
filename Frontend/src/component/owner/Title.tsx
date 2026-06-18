
type TitleProps = {
  title: string
  subtitle: string
}

const Title = ({title,subtitle}:TitleProps) => {
  return (
    <div className={`flex flex-col justify-center items-start text-left`}>
      <h1 className='font-semibold text-3xl md:text-4xl'>{title}</h1>
      <p className='text-sm md:text-base text-gray-500/90 max-w-156 pt-3'>{subtitle}</p>
    </div>
  )
}

export default Title
