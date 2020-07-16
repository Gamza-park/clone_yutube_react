import React, { useState } from 'react'
import {Comment, Avatar, Button, Input} from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment(props) {

    const user = useSelector(state => state.user);
    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")

    const onClickOpenReply = () => {
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        console.log(props)
        const variables ={
            content: CommentValue,
            writer: user.userData._id,
            postId: props.videoId ,
            responseTo: props.comment._id
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success){
                console.log(response.data.result)
                props.refreshFunction(response.data.result)
                setCommentValue("")
                setOpenReply(false)

            } else{
                alert("Failed Save Comment")
            }
        })
    }
    
    

    const actions = [
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id}/>,
        <span onClick={onClickOpenReply} key='comment-basic-reply-to'>Reply to</span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={<p>{props.comment.content}</p>}
            />
            {OpenReply && 
                <form style={{ display: 'flex' }} onSubmit={onSubmit} >
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={onHandleChange}
                    value={CommentValue}
                    placeholder="Please Write Reply"
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Send</button>
            </form>
            }
            

        </div>
    )
}

export default SingleComment
