// Function to calculate Levenshtein distance between two strings
function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
            if (i === 0) {
                dp[i][j] = j;
            } else if (j === 0) {
                dp[i][j] = i;
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j - 1] + (str1[i - 1] === str2[j - 1] ? 0 : 1),
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1
                );
            }
        }
    }

    return dp[m][n];
}

// Function to find similar FAQ question
function findSimilarFAQ(userQuestion, FAQs, threshold) {
    let minDistance = Infinity;
    let similarQuestion = null;

    for (const FAQ of FAQs) {
        const distance = levenshteinDistance(userQuestion.toLowerCase(), FAQ.question.toLowerCase());
        if (distance < minDistance) {
            minDistance = distance;
            similarQuestion = FAQ;
        }
    }

    if (minDistance <= threshold) {
        console.log("💡 ~ findSimilarFAQ ~ minDistance:", minDistance)
        return similarQuestion;
    } else {
        return null;
    }
}

// Example usage:
const userQuestion = "is available in bhutan";
const FAQs = [
    { question: "is it available in bhutan?" },
    { question: "What are the key features of Engage?" },
    { question: "Can you list the functionalities of Engage?" },
    { question: "What does Engage offer in terms of features?" },
    { question: "How would you describe the features of Engage?" },
    { question: "What are the main components of Engage?" }
];

const threshold = 3; // Adjust the threshold as needed

const similarFAQ = findSimilarFAQ(userQuestion, FAQs, threshold);
if (similarFAQ) {
    console.log("Similar question found:", similarFAQ.question);
} else {
    console.log("No similar question found.");
}
