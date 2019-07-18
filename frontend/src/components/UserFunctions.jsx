import axios from 'axios'

export function register(newUser) {
    console.log(newUser.username)
    //var result = "fail"
    return axios
    .post('http://127.0.0.1:4897/users/signup', {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password
    })
    // .then(res => {
    //     console.log(res)
    //     console.log(res.data.result)
    //     if (res.data.result === "success") {
    //         result = "success"
    //     } else {
    //         console.log("fail")
    //     }
    //     return result;
    //     //console.log()
    // })
    // .catch(function (error) {
    //     console.log(error);
    // })
   
}

export function login(user) {
    return axios
    .post('http://127.0.0.1:4897/users/login',{
        username: user.username,
        password: user.password
    })
} 