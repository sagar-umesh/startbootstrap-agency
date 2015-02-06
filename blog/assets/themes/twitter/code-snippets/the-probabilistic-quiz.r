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