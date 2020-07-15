import Axios from 'axios'
import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {

    const user = useSelector(state => state.user)
    const [commentValue, setcommentValue] = useState("")
    const handleClick = (e) => {
        setcommentValue(e.currentTarget.value)
    }
    const onSubmit = (e) => {
        e.preventDefault()

        const variables ={
            content: commentValue,
            writer: user.userData._id,
            postId: props.postId 
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success){
                console.log(response.data.result)
                props.refreshFunction(response.data.result)
                setcommentValue("")
            } else{
                alert("Failed Save Comment")
            }
        })
    }

    return (
        <div>
            <br />
            <p> Replies</p>
            <hr />

            {/* Comment Lists */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} videoId={props.postId}/>
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} videoId={props.postId} commentLists={props.commentLists} />
                    </React.Fragment>
                )
            ))}
            


            {/* Root Comment From */}

            <form style={{ display: 'flex' }} onSubmit={onSubmit} >
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="Please Write Comment"
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Send</button>
            </form>
        </div>
    )
}

export default Comment
