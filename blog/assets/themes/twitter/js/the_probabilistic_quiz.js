$("#run_simulation").click(function() {
    var num_questions = parseInt($('#num_questions').val());
    var num_options = parseInt($('#num_options').val());
    var num_quiz_trials = parseInt($('#num_quiz_trials').val());
    var num_sim_trials = parseInt($('#num_sim_trials').val());

    run_simulation(num_questions, num_options, num_quiz_trials, num_sim_trials);
});

function sample(arr, num, replace) {
    var random_sample = [];
    var random_index;
    replace = (typeof replace !== 'undefined')? replace : true;
    for(var i = 0; i < num && arr.length != 0; i++) {
        random_index = Math.floor(Math.random() * arr.length);
        random_sample.push(replace === true? arr[random_index] : arr.splice(random_index, 1)[0])
    }
    return random_sample;
}

function seq(start, end) {
    var sequence = [];
    for(var i = start; i <= end; i++) {
        sequence.push(i);
    }
    return sequence;
}

function run_simulation(num_questions, num_options, num_quiz_trials, num_sim_trials) {
    var num_correct = [];
    var options = [];

    for(var i = 0; i < num_sim_trials; i++) {
        var correct_answers = sample(seq(1,num_options), num_questions);
        var available_selections = [];
        for(var j = 0; j < num_questions; j++) {
            available_selections.push(seq(1, num_options));
        }

        var chosen_answers = [];
        for(var j = 0; j < num_quiz_trials; j++) {
            chosen_answers = [];
            var chosen_answer;
            for(var k = 0; k < num_questions; k++) {
                if(available_selections[k].length > 1) {
                    chosen_answer = sample(available_selections[k], 1)[0];
                } else {
                    chosen_answer = available_selections[k];
                }

                if(chosen_answer == correct_answers[k]) {
                    available_selections[k] = [chosen_answer];
                } else {
                    available_selections[k].splice(available_selections[k].indexOf(chosen_answer), 1);
                }

                chosen_answers.push(chosen_answer);
            }
        }

        num_correct.push(chosen_answers.map( function(cur, index) {
            return (cur == correct_answers[index]);
        }).reduce( function(prev, val){ 
            prev += (val === true)? 1 : 0;
            return prev;
        }, 0 ));
    }

    var hist = {}
    num_correct.forEach(function(elem, index, arr) {
        hist[elem] = (typeof hist[elem] === "undefined")? 1 : hist[elem] + 1;
    });

    var numericals = [];
    var freq = [];
    for(var key in hist) {
        numericals.push(key + "");
        freq.push(hist[key]);
    }

    // set the theoritical value
    var theoritical_value = num_questions / num_options * (num_quiz_trials > num_options? num_options : num_quiz_trials);
    $("#theoritical").text(theoritical_value);

    var plot = $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Histogram of correct answers of ' + num_sim_trials + ' trials.'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: numericals,
            title: {
                text : 'Number of correct answers for ' + num_questions + ' questions and ' + num_quiz_trials + ' attempts.'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Count'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} occurances</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Sample Trial',
            data: freq
        }]
    });
}

// click the button to initialize
$("#run_simulation").click();