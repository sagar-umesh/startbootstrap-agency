---
layout: post
title:  "The Probabilistic Quiz"
date:   2015-02-03 19:27:00
categories: technical
jsfiles:
- jquery.min
- bootstrap.min
- highcharts-release/highcharts
- highcharts-release/modules/exporting
- blog/the_probabilistic_quiz
cssfiles:
- bootstrap.min
---

"Hello World!"

Yes, its a tradition, and a good one at that!
Whether you like it or not, randomness rules our lives. The degree of randomness may vary, but the inevitable fact remains. This is a blog post about how I predicted the score I would get on a quiz. Rather, the score that I was *supposed* to get if I chose the answers randomly.

I had taken up a course on [Coursera][coursera]. I must say, I *probably* learnt quite a bit of probability in the course. It so happened that I was running behind schedule by a large margin for a quiz that was due on a Sunday. I had no clue what the course content was, let alone what the questions meant. And the clock was ticking! Remember? randomness controls us. Then I thought, "Why not apply what I had learnt? Lets see if I can predict the score when I answer questions randomly.".

Here's how this particular quiz was structured: There were 9 questions with 4 choices each. You get 3 attempts at the quiz. The questions, nor the choices change after each attempt. The order of the choices might change though.

Lets get predicting!

**Attempt 1:**<br />
Given a single question, `4` choices and 1 correct answer, what is the probability that you'll pick the right choice if you're asked to choose randomly? Well, thats simple. Its `(1/4)`.<br />
What if I give you `2` questions, `4` choices each and 1 correct answer, what then? `(2/4)`, isn't it?<br />
What if I you have `3`questions? You'll get `3/4` questions right. <br />
If you had `9` questions, you'll get `9/4` right. Hold on to that thought!<br />

**Attempt 2:**<br />
The questions and choices will not change in this attempt, remember? Good. Now that you've got `9/4` answers already right, you can just carry them over to this attempt. In this attempt, you'll have to answer `9 - 9/4 = 9 * (3/4)` questions right. For the sake of brevity, lets call this `n1`. So, `n1 = 9 * (3/4)`.<br />
In this attempt, lets do something smart. For the `n1` questions that you got wrong, you know what you had chosen earlier. The same choice cannot be the answer, obviously. Now, your sample space has reduced to `3`, instead of `4`. If you choose the answers randomly for these `n1` questions, how many will you get right? `n1 / 3`, right!<br />
The remaining questions are `n2 = n1 - (n1/3) = n1 * (2/3)`.<br />
Lets substitute for `n1`: `n2 = 9 * (3/4) * (2/3)`.<br />
Do you *see* a pattern? Exactly!

**Attempt 3:**<br />
The same rules apply here: same questions, same choices. For the remaining `n2` questions, you know the 2 choices that are wrong. Your sample space is further reduced to 2. Following the same process, you'd get `n2 / 2` questions right.<br /> 
The remining questions are,<br/> `n3 = n2 - n2 / 2`<br />`= n2 * (1/2)`<br />`= 9 * (3/4) * (2/3) * (1/2)` <br /> `= 9/4`.

By the end of the third attempt, you would've answered `9 - (9/4) = 9 * (3/4)` questions right. Thats a whopping 75%! Thats great, for someone who doesnt even know what the questions are. In this case, 75% turns out to be **6.75** questions.

I put this theory to the test. And guess, what.. **I got 7 questions right out of 9!**<br />
But that cant always be that accurate. There *must* be a method to the madness. There must be a *distribution*.<br />

**Generalization:**<br />
For a quiz with `n` questions, `c` choices and `k` attempts, the number of remaining right answers is given by:<br />
`n * (k / c)`<br />
Wondering how I got this formula? Drop me an email, lets discuss! :)

`9` questions; `4` choices each; `3` attempts; `1000` experiments. In each experiment, I noted down the number of correct answers. Here's what the distribution of the number of correct answers looks like. Feel free to change the parameters and run simulations.<br />

<div id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
<div>
	Number of questions: <input type="number" id="num_questions" value="9"/>
</div>
<div>
	Number of choices: <input type="number" id="num_options" value="4"/>
</div>
<div>
	Number of attempts: <input type="number" id="num_quiz_trials" value="3"/>
</div>
<div>
	Number of experiments: <input type="number" id="num_sim_trials" value="1000"/>
</div>
<div>
	<button id="run_simulation">Run Simulation</button>
</div>

Theoritically predicted value using `n * (k / c)` is **<span id="theoritical"></span>**.<br /> As you can see from the plot, the mean of the distribution is centered around our theoritically determined value. I dont know how to theoritically compute the variance of the plot thought. Any thoughts?

Initially, I had written an **R** to simulate the experiment. Here's the code. I know, its a bit clumsy. I'm sure there are much better ways to simulate this quiz. Do let me know if you know any of them.

{% highlight r %}
# Proceed with caution, clumsy code ahead! But rest assured, it works.
# You're more than welcome to tweak this code to play around with the parameters.
library(ggplot2)
num_sim_trials <- 1000
num_quiz_trials <- 3
num_questions <- 9
num_options <- 4

num_correct = c()
for(i in 1:num_sim_trials) {
        correct_answers <- sample(1:num_options, num_questions, replace = T)
        available_selections <- list()
        for(q in 1:num_questions) {
                available_selections[[q]] = 1:num_options
        }
        
        for(j in 1:num_quiz_trials) {
                chosen_answers = c()
                for(q in 1:num_questions) {
                        if (length(available_selections[[q]]) > 1) {
                                chosen_answer = sample(available_selections[[q]], 1)
                        } else {
                                chosen_answer = available_selections[[q]]
                        }
                        
                        if(chosen_answer == correct_answers[q]) {
                                available_selections[[q]] = c(chosen_answer)
                        } else {
                                available_selections[[q]] = available_selections[[q]][ available_selections[[q]] != chosen_answer ]
                        }
                        chosen_answers = c(chosen_answers, chosen_answer)
                }
        }
        num_correct = c(num_correct, sum(correct_answers == chosen_answers))
}
df = data.frame(correct = num_correct)
g = ggplot(df) + aes(x = correct)
g = g + geom_histogram(binwidth = 0.5)
g = g + xlab(paste("Number of correct answers for", num_questions, "questions and", num_quiz_trials, "attempts."))
g = g + ggtitle(paste("Histogram of correct answers for", num_sim_trials, "trials"))
print(g)
{% endhighlight %}

I hope this blog post inspired you to look into the subtle everyday randomness. Until next time.. adios!

[coursera]: http://coursera.org