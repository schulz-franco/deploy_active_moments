import { getSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Comment from "../../components/post/Comment"
import { usePostContext } from "../../context/post"
import { useUserContext } from "../../context/user"
import { commentPost, likePost } from "../../services/post"
import { formatDifTime } from "../../utilities/times"

const API_URL = process.env.NEXT_PUBLIC_API_URL

let commentsData = [
    {
        owner: {
            id: "",
            username: "Nombre de usuario",
            image: ""
        },
        comment: "Contenido",
        date: "2023-01-28T04:01:26"
    },
    {
        owner: {
            id: "",
            username: "Nombre de usuario",
            image: ""
        },
        comment: "Contenido",
        date: "2023-01-28T04:01:26"
    },
    {
        owner: {
            id: "",
            username: "Nombre de usuario",
            image: ""
        },
        comment: "Contenido",
        date: "2023-01-28T04:01:26"
    },
    {
        owner: {
            id: "",
            username: "Nombre de usuario",
            image: ""
        },
        comment: "Contenido",
        date: "2023-01-28T04:01:26"
    }
]

const PostPage = () => {
    const { post } = usePostContext()
    const { user } = useUserContext()
    const router = useRouter()
	const [open, setOpen] = useState(false);
	const [countLikes, setCountLikes] = useState(post.likes.length)
    const [like, setLike] = useState(post.likes.includes(user.id))
	const [loading, setLoading] = useState(false)
    const [comments, setComments] = useState(post.comments)

    useEffect(()=> {
        if (!post.owner.id) {
            router.push("/feed")
        }
    }, [])

	let names = post.owner.name ? (post.owner.lastname ? post.owner.name + " " + post.owner.lastname : post.owner.name) : (post.owner.lastname ? post.owner.lastname : "")
	let profileImage = post.owner.image ? (API_URL + post.owner.image) : "/assets/profile.png"
	let usernameStyles = names ? {} : {fontSize: '1.1rem'}
	let time = formatDifTime(post.createdAt)
    let isLike = like ? "/assets/post/muscleLike.png" : "/assets/post/muscleDisLike.png"
    let likesMessage = countLikes ? (countLikes === 1) ? `A 1 persona le ha gustado esto` : `A ${countLikes} personas les ha gustado esto` : "No hay me gustas"

	const onOpenMenuHandler = () => {
		setOpen(!open)
	}

	const onLikeHandler = async ()=> {
		if (!loading) {
			setLoading(true)
			const { user } = await getSession()
			if (!like) setCountLikes(countLikes => countLikes + 1)
			else setCountLikes(countLikes => countLikes - 1)
			setLike(!like)
			likePost(post._id, user.token).then(res => {
				setLoading(false)
			}).catch(error => {
				console.log(error)
				setLoading(false)
			})
		}
	}

    const onCommentHandler = (ev)=> {
        ev.preventDefault()
        const [postId, comment, token] = [post._id, ev.target[0].value, user.token]
        if (comment.length < 201) {
            commentPost(postId, comment, token).then(res => {
                ev.target[0].value = ""
                setComments([ res.data, ...comments ])
            }).catch(err => {
                console.log(err)
            })
        }
    }

    if (post.owner.id) return (
        <div id="postPage">
            <div className="publicationContainer">
                <div className="square">
                    <div className="user">
                        <Image width='50' height='50' src={profileImage} alt="Usuario"/>
                        <div className='info' >
                            {names && <span className="names">{names}</span>}
                            <Link href={`/perfil/${post.owner.id}`} style={usernameStyles} className="username">{post.owner.username}</Link>
                            <span className='date'>{time}</span>
                        </div>
                        <div className="menuContainer">
                            <Image className='menu' onClick={onOpenMenuHandler} width='30' height='30' src="/assets/post/tresPuntos.png" alt='Menu'/>
                            {open && <div className="menu">
                                <div className="arrow"></div>
                                <span>Eliminar</span>
                                <span>Reportar</span>
                            </div>}
                        </div>
                    </div>
                    {post.content && <p>{post.content}</p>}
                    {post.image && <Image width='300' height='300' className='publication' alt='Usuario' src={API_URL + post.image} />}
                </div>
                <div className="likes">
                    <Image width='30' height='30' src={isLike} alt='Me gusta' onDoubleClick={(ev) => ev.preventDefault()} onClick={onLikeHandler} />
                    <span>{likesMessage}</span>
                </div>
                <h4>Comentarios</h4>
            </div>
            <div className="comments">
                {comments.map((comment, index) => {
                    return <Comment key={index} data={comment} />
                })}
            </div>
            <form onSubmit={onCommentHandler} className="comment">
                <Image width='40' height='40' src={profileImage} alt="Usuario"/>
                <input type="text" name="content" placeholder="Escribe un comentario..." maxLength='200' required />
            </form>
        </div>
    )
}

export default PostPage