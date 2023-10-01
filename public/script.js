const wrapper=document.querySelector(".wrapper");
const loginLink=document.querySelector(".login-link");
const registerLink=document.querySelector(".register-link");
const loginBtn=document.querySelector(".login-Btn");
const closeWrap=document.querySelector(".wrapper-close")

closeWrap.addEventListener('click',()=>{
    wrapper.classList.remove('popup');
})
loginBtn.addEventListener('click', ()=>{
    wrapper.classList.add('popup');
})

registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
});
  
loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
});