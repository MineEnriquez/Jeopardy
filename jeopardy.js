GetQuestions("https://opentdb.com/api.php?amount=10&category=12", 1);
GetQuestions("https://opentdb.com/api.php?amount=10&category=20", 2);
GetQuestions("https://opentdb.com/api.php?amount=10&category=9", 3); 

function GetQuestions(_url, _id) {
    $.get(_url, function (data) {
        $("#subtitle" + _id).text(data.results[0].category);
        console.log("Section: ", _id);

        var lst = $("#section" + _id);
        var section = _id;
        var questionNumber = 1;
        var results = data.results;

        results.forEach(element => {
            var numberOfPoints;
            switch (element.difficulty) {
                case "easy":
                    numberOfPoints = 200;
                    break;
                case "medium":
                    numberOfPoints = 300;
                    break;
                case "hard":
                    numberOfPoints = 400;
                    break;
                default:
                    numberOfPoints = 0;
                    break;
            }
            var Qid = section + "_Question" + questionNumber;
            var Pid = section + "_Points" + questionNumber;
            var seg = "<div class='question points' onclick='showQuestion(&apos;" + Qid + "&apos;, &apos;" + Pid + "&apos;)' id='" + Pid + "'><br> <br> <h1 id='points'>" + numberOfPoints + "</h1> </div>";
            seg += "<div class='question ' style='display: none;' data-value=" + numberOfPoints + " id='" + Qid + "'> [" + numberOfPoints + "] :" + element.question;
            responses = element.incorrect_answers;

            if (responses.length > 1) {
                var x = Math.floor((Math.random() * (responses.length)));
                var temp = responses[x];
                console.log("long responses", responses.length, x, element.correct_answer);
                responses[x] = element.correct_answer;
                responses.push(temp);
            } else {
                var x = Math.floor((Math.random() * (2)));
                if (x == 0) {
                    var temp = responses[0];
                    responses[0] = element.correct_answer;
                    responses.push(temp);
                } else {
                    responses.push(element.correct_answer);
                }
                console.log("true or false: ", responses.length, x, element.correct_answer);
            }

            seg += "<div class='option' onclick='checkAnswer(&apos;" + Qid + "&apos;)'>";
            for (var i = 0; i < responses.length; i++) {
                seg += "<input type='radio' id='Response_" + Qid + "' name='Response_" + Qid + "' value='" + responses[i] + "'> " + responses[i] + "<br>";
            }
            seg += "<p id='CorrectResponse' class='hidden'  >" + element.correct_answer + "</p> <h4 id='answer'><h4>";
            seg += "</div></div>";
            lst.append(seg);
            questionNumber++;
        });


    })
}
function showQuestion(QuestionId, PointId) {
    console.log("Here at showq....");
    var qid = "#" + QuestionId;
    var pid = "#" + PointId;
    $(pid).attr("style", 'display: none;');
    $(qid).attr("style", 'display: block;');

}
function checkAnswer(QuestionId) {
    let answer = $("input[name='Response_" + QuestionId + "']:checked").val();
    console.log(answer);
    let correctAnswer = $("#" + QuestionId + " #CorrectResponse").text();
    console.log(correctAnswer);
    var res = "";
    var t = parseInt($("#totalpoints").text());
    var points = parseInt($("#" + QuestionId).data('value'));
    if (answer == correctAnswer) {
        $("#" + QuestionId + " #answer").text("Correct!").addClass("correct");
        $("#" + QuestionId).addClass("GreenDisabled");
        $("#totalpoints").text(t + points);
        $.confetti.start();
    }
    else {
        $("#" + QuestionId + " #answer").text("Wrong! ( " + correctAnswer + " )").addClass("boo");
        $("#" + QuestionId).addClass("GrayDisabled");
        var points = parseInt($("#" + QuestionId).data('value'));
        $("#totalpoints").text(t - points);
    }
}