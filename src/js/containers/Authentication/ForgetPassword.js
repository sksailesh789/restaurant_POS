import React , {useState,useEffect,Fragment} from 'react'
import {forgetPassword} from "../../actions/auth"
import classnames from "classnames";
import { useDispatch,useSelector } from 'react-redux';



const ForgetPassword = () => {
    
    const [email,setEmail] = useState('')
    const [errors,setErrors] = useState('')
    const [message,setMessage] = useState('')

    const dispatch = useDispatch();

    const msg = useSelector(state => state.auth.message)

  useEffect(() => {
    setMessage(msg)
  }, [msg])

    const submitHandler = (e) => {
        e.preventDefault();
        const data= {
          email:email
        }
        dispatch(forgetPassword(data))
    }

  return (
    <Fragment>
        <div className='container'>
          {message ? (
              <div className='message-show'>{message}</div>
              ) : (
                <div className="fp-wrap">
                <h5>Forgot Password</h5>
              <form noValidate className="form" onSubmit={(e) => submitHandler(e)}>
                <div className="form-group">
                <label for="email">Email :</label>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    className={classnames({ "is-invalid": errors.email })}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <input type="submit" className="btn-waft " value="Recover Password" />
                    
                </form>
              </div>
              )}
          
        </div>
        
    </Fragment>
  )
}

export default ForgetPassword