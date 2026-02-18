# GitFolio: An AI-Powered GitHub Portfolio and Resume Generator

listen i will clear my project more now to you what exactly it is basically i want a user to come on my website then he can login through google sign up or make a account themselves or signup using github oauth then after successful login if the user has sign n using github oauth then automatically all his data is fetched and there will be a screen aslking generate your portfolio website and if user has not signed in using github oauth does not want to give access t private repos then after login he will be asled to enter his giuthub username and then generate portfolio website  and after the portfolio website is generated with url gitfolio.in/usrename then on screen user will have option to view in light and dark mode , change themes, add some sections like achievement education which will be fetched if the user will have a detailed profile readme but if he doesnt have then he can add that himself o the website page by adding the desired section the componet will be made for that after he completes adding the data and there will be also an option to generate resumes with help of all this data and after generating the resume one can edit the text size , font type , heading colors , text bold italic options ,add hyperlinks , and an optiom to download resume in pdf format
so all this my website can do and this all is what i want right now
later on there can be any additions but these are basics
for tech stack for this project is react js javascript taiwlindcss framer motion gemini api key for all ai related tasks and firebase auth and firestore db and firebase in backend and vercel for deployment

- user image will be te first letter of their name for now
- its a developer focused portfolio and resume generator
- flow is user is logging in then all the data that can be fetched from github rest api is fetched according to the need of the project and then it is parsed to gemini api and then the data is stored in firestore db and then the portfolio is shown on ui
- user has the option to add any section as you know as discussed
- also the light and dark theme option is on portfolio page and on resume page but on resume page the paper on which resume is will be white only and pdf generated also on white paper
- the original webste of gitfolio follows dark theme only modern design

## some important points

- update route switching
