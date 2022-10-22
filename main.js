
let renderTime = () => {
    let subDate = new Date();
    let thatTime = getMsTime(subDate);
    if(timer.state == "runned"){
        drawTimer(translateTime(thatTime - timer.start - timer.static));
    }
}
let drawTimer = (time) => {
    timer.link.html(time);
}

let getMsTime = (date) => {
    return date.getTime();
}

let translateTime = (time) => {
    ms = time % 1000; 
    s = Math.floor(time / 1000) % 60; 
    mins = Math.floor(Math.floor(time / 1000) / 60); 
    return mins.toString().padStart(2, '0')+":"+s.toString().padStart(2, '0')+","+ms.toString().padStart(2, '0').slice(0, 2);
}


let showButtons = (buttons) => {
    $(".button").addClass("hidden");
    buttons.forEach(element => {
        $("#"+element).removeClass("hidden");
    });
}

let timer = {
    static: 0,
    start: 0,
    startPause: 0,
    rounds: [],
    renderRounds: () => {
        let html = "";
        timer.rounds.forEach(element => {
            html += '<li class="item"><div>Круг '+element[0].toString()+'</div><div>'+translateTime(element[1]).toString()+'</div></li>';
        });
        $(".list").html(html)
    },
    clearRounds: () => {
        timer.rounds = [];
        timer.renderRounds();
    },
    link: $(".timer"),
    state: "stopped",
    setState: (state) => {
        timer.state = state;
        switch(state){
            case "stopped":
                showButtons(["round", "start"])
                break;
            case "runned":
                showButtons(["round", "stop"])
                break;
            case "paused":
                showButtons(["cancel", "continue"])
                break;
                        
        }
    },
    doAction: (action) => {
        switch (action) {
            case "stop":
                timer.setState("stopped");
                timer.static = 0;
                timer.start = 0;
                timer.startPause = 0;
                timer.clearRounds();
                drawTimer('00:00,00');
                break;
            case "run":
                if(timer.state != "stopped"){
                    break;
                }
                timer.setState("runned");
                let date = new Date();
                let startTime = getMsTime(date);
                timer.static = 0;
                timer.start = startTime;
                timer.startPause = 0;
                break;
            case "continue":
                if(timer.state != "paused"){
                    break;
                }
                timer.setState("runned");
                let continueDate = new Date();
                let continueTime = getMsTime(continueDate);
                timer.static += continueTime - timer.startPause;
                timer.startPause = 0;
                break;
            case "pause":
                if(timer.state != "runned"){
                    break;
                }
                timer.setState("paused");
                let pauseDate = new Date();
                let pauseTime = getMsTime(pauseDate);
                timer.startPause = pauseTime;
                break;
            case "round":
                if(timer.state != "runned"){
                    break;
                }
                if(timer.rounds.length == 0){
                    timer.rounds.unshift([1, getMsTime(new Date()) - timer.start]);
                } else{
                    let item = timer.rounds[0];
                    timer.rounds.unshift([item[0]+1, getMsTime(new Date()) - timer.start - item[1]]);
                }
                timer.renderRounds();
                break;
        }
    }
}


setInterval(() => {
    renderTime()
}, 4);

