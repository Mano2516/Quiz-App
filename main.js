let countSpan = document.querySelector(".quiz-info .count span");
let bulletSpanCont = document.querySelector(".bullets .spans")
let current = 0;
let quizArea =document.querySelector(".quiz-area")
let answerArea = document.querySelector(".answers-area")
let submitBtn = document.querySelector(".submit-button")
let rightAns = 0;
let bullets = document.querySelector(".bullets")
let res = document.querySelector(".results")
let countdownint;
let countDownSpan = document.querySelector(".countdown")
function getQuestions(){

    let myReq = new XMLHttpRequest();

    myReq.onload = function () {

        if(this.readyState === 4 && this.status === 200) {

            let qObject = JSON.parse(this.responseText);

            let QCount = qObject.length;

            createbullets(QCount)

            addQuestionData(qObject[current],QCount);

            countDown(5,QCount)

            submitBtn.onclick =function(){

                let rightAnswer = qObject[current].right_answer;
                // console.log(rightAnswer)

                current++;

                checkAnswer(rightAnswer,QCount)

                quizArea.innerHTML="";

                answerArea.innerHTML="";

                addQuestionData(qObject[current],QCount);

                handelClasses();

                clearInterval(countdownint)

                countDown(5,QCount)

                showRes(QCount);

            }

        }
    };



    myReq.open("GET","question.json",true)

    myReq.send();


}
getQuestions();

function createbullets(num){
    countSpan.innerHTML=num;

    for(let i= 0; i<num ;i++) {

        let theBullet =document.createElement("span");

        if(i===0){
            theBullet.className="on";
        }

        bulletSpanCont.appendChild(theBullet)
    }
}

function addQuestionData(obj , count) {

    if (current<count){
        let qTitle= document.createElement("h2");

        qTitle.appendChild(document.createTextNode(obj.title))
    
        quizArea.appendChild(qTitle)
    
        for(let i =0 ; i<4 ; i++) {
    
            let mainDiv =document.createElement("div");
    
            mainDiv.className="answer";
    
            let radio = document.createElement("input")
    
            radio.type='radio';
    
            radio.name='question';
    
            radio.id=`answer_${i + 1}`
    
            radio.dataset.answer = obj[`answer_${i + 1}`];
    
            if(i===0){
    
                radio.checked=true;
    
            }
    
            let lable =document.createElement("label");
    
            lable.htmlFor=`answer_${i + 1}`
    
            lable.appendChild(document.createTextNode(obj[`answer_${i + 1}`]))
    
            mainDiv.appendChild(radio);
    
            mainDiv.appendChild(lable)
    
            answerArea.appendChild(mainDiv)
    
        }
    }
}

function checkAnswer(rAns, count){

    let answers = document.getElementsByName("question")

    let choosenAns;

    for(let i =0 ;i <answers.length;i++){

        if(answers[i].checked){

            choosenAns=answers[i].dataset.answer;

        }

    }

if(rAns===choosenAns){

    rightAns++;

}

}

function handelClasses(){

    let bullSpan = document.querySelectorAll(".bullets .spans span")

    let arrSpans = Array.from(bullSpan);

    arrSpans.forEach((span , index)=>{

        if(current===index){
            span.className="on";
        }


    })
}
function showRes(count){
    let theRes;
    if(current===count){
        quizArea.remove();
        answerArea.remove();
        submitBtn.remove();
        bullets.remove();

        if(rightAns > (count/2)&& rightAns<count) {
            theRes=`<span class="good">Good</span> ,${rightAns} From ${count}`
        }
    else if (rightAns===count){
            theRes=`<span class="perfect">Perfect</span> ,${rightAns} From ${count}`
    }else{
        theRes=`<span class="bad">Bad</span> ,${rightAns} From ${count}`
    }

    res.innerHTML=theRes;
    res.style.padding = "10px";
    res.style.backgroundColor = "#fff";
    res.style.marginTop = "10px";
}
}

function countDown(duration , count){
    if(current<count){

        let minutes , seconds ;

        countdownint= setInterval(function(){

            minutes=parseInt(duration/60);

            minutes= minutes <10 ? `0${minutes}`: minutes;

            seconds=parseInt(duration%60);

            seconds= seconds<10? `0${seconds}`:seconds;

            countDownSpan.innerHTML=`${minutes}:${seconds}`

            if(--duration<0){

                clearInterval(countdownint)

                submitBtn.click();

            }

        },1000)

    }
}