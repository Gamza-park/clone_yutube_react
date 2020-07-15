import Axios from 'axios'

import React, { useEffect, useState } from 'react'

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)


    useEffect(() => {
        
        let variable ={ userTo: props.userTo }

        Axios.post('/api/subscribe/subscribeNumber', variable)
        .then( response => {
            if(response.data.success) {
                setSubscribeNumber(response.data.subscribeNumber)
            } else{
                alert('Failed Subscriber info')
            }
        })

        let subscribedVariable ={ userTo: props.userTo, userFrom: localStorage.getItem('userId') }

        Axios.post('/api/subscribe/subscribed', subscribedVariable)
        .then(response => {
            if(response.data.success) {
                setSubscribed(response.data.Subscribed)
            } else {
                alert('failed get info')
            }
        })

    }, [])
    
    const onSubscribe = () => {

        let subscribeVariables = {
            userTo : props.userTo,
            userFrom : props.userFrom
    }

        if(Subscribed){
            Axios.post('/api/subscribe/unSubscribe', subscribeVariables)
            .then(response => {
                if(response.data.success) {
                    setSubscribeNumber(SubscribeNumber - 1)
                    setSubscribed(!Subscribed)
                } else {
                    alert('Failed! Subscribe Cansle')
                }
            })
        } else {
            Axios.post('/api/subscribe/subscribe', subscribeVariables)
            .then(response => {
                if(response.data.success) {
                    setSubscribeNumber(SubscribeNumber + 1)
                    setSubscribed(!Subscribed)
                } else {
                    alert('Failed! Subscribe Cansle')
                }
            })
        }
    }

    return (
        <div>
            <button
                style={{ backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000' }`, borderRadius: '8px',
                    color:'white', padding: '10px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
