import Image from 'next/image'
import Link from 'next/link'

const NavMobile = () => {

  return (
    <div className='user'>
      <div className="name">
      <Link href='/'>
   <Image className='search' width={28.86} height={28.43} src="/assets/search.png" alt='search' />
    </Link> 
      </div>
    <div className='logo'>
    <Link href={'/'}> <Image className='logoImg' width={40} height={40} src="/assets/logo.svg" alt='user' /></Link>
        <Link href={'/'}> <Image className='logoName' width={100} height={15} src="/assets/title.png" alt='user' /></Link>
    </div>
  <div className='name'>
    <Link href='/'>
    <Image className='logoUser' width={28.86} height={28.43} src="/assets/user2.png" alt='logo usuario' />
    </Link> 
  </div>
    </div>
  )
}

export default NavMobile