import React from 'react'




const Modal = ({show,handleClose,children,large,medium}) => {
  return (
    <div className="modal_wrap" onClick={(e) => handleClose(e)} >
                    <div 
                        // style={{
                        //     transform: true ? 'translateY(0)' : 'translayeY(-100vh)',
                        // }} 
                    className = {`
                        modal_custom ,
                        ${large  ? 'wh_80' : ''}
                        ${medium  && 'wh_50' }

                    `}
                        onClick={e => {
                            console.log(show)
                            e.stopPropagation()}}
                        >
                        {children}
                        
                    </div>
                </div>
  )
}

export default Modal