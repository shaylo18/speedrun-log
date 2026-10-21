const g=id=>document.getElementById(id);
async function handleRegister(e){
  e.preventDefault();
  const full_name=g('fullName').value.trim(),email=g('email').value.trim(),password=g('password').value;
  if(password!==g('confirmPassword').value)return showMessage('msg','Passwords do not match');
  const{data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name}}});
  if(error)return showMessage('msg',error.message);
  if(data.session)return location.href='dashboard.html';
  showMessage('msg','Account created. Check your email to confirm, then log in.',false);
}
async function handleLogin(e){
  e.preventDefault();
  const{error}=await supabase.auth.signInWithPassword({email:g('email').value.trim(),password:g('password').value});
  if(error)return showMessage('msg',error.message);
  location.href='dashboard.html';
}
async function handleForgotPassword(){
  const email=prompt('Enter your account email:');
  if(!email)return;
  const{error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:location.origin+'/profile.html'});
  showMessage('msg',error?error.message:'Reset link sent. Check your email.',!!error);
}
async function handleLogout(e){
  if(e)e.preventDefault();
  try{await supabase.auth.signOut({scope:'local'})}catch(err){console.error(err)}
  Object.keys(localStorage).filter(k=>k.startsWith('sb-')).forEach(k=>localStorage.removeItem(k));
  location.href='login.html';
}