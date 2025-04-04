document.addEventListener('DOMContentLoaded', function() {
    const contentSection = document.getElementById('content');
    let currentUnitData = null; // Store the data object of the currently loaded unit
    let currentUnitExercises = []; // Store generated exercises for the current unit

    // --- Word Lists (Expanded) ---
    const commonNouns = ['cat', 'dog', 'house', 'ball', 'tree', 'book', 'car', 'flower', 'teacher', 'student', 'city', 'river', 'friend'];
    const properNouns = ['Fido', 'London', 'Paris', 'Sarah', 'David', 'Amazon', 'Nile', 'Monday', 'January'];
    const subjects = ['I', 'You', 'He', 'She', 'It', 'We', 'They', 'The cat', 'The dog', 'My friend', 'The students', 'Sarah', 'David'];
    const presentVerbsMap = {
        run: { s: 'runs', base: 'run' }, jump: { s: 'jumps', base: 'jump' }, eat: { s: 'eats', base: 'eat' },
        sleep: { s: 'sleeps', base: 'sleep' }, play: { s: 'plays', base: 'play' }, read: { s: 'reads', base: 'read' },
        write: { s: 'writes', base: 'write' }, sing: { s: 'sings', base: 'sing' }, swim: { s: 'swims', base: 'swim' },
        draw: { s: 'draws', base: 'draw' }, talk: { s: 'talks', base: 'talk' }
    };
    const pastVerbsMap = { // Simple past tense
        run: 'ran', jump: 'jumped', eat: 'ate', sleep: 'slept', play: 'played', read: 'read', // 'read' pronounced differently
        write: 'wrote', sing: 'sang', swim: 'swam', draw: 'drew', talk: 'talked', go: 'went', see: 'saw', is: 'was', are: 'were'
    };
    const baseVerbs = Object.keys(presentVerbsMap);
    const adjectives = ['happy', 'sad', 'big', 'small', 'red', 'blue', 'green', 'fast', 'slow', 'fluffy', 'sunny', 'bright', 'loud', 'quiet', 'tall', 'short'];
    const subjectPronouns = ['I', 'you', 'he', 'she', 'it', 'we', 'they'];
    const objectPronouns = ['me', 'you', 'him', 'her', 'it', 'us', 'them'];
    const pluralNounsMap = { // Singular: Plural
        cat: 'cats', dog: 'dogs', house: 'houses', ball: 'balls', tree: 'trees', book: 'books', car: 'cars',
        flower: 'flowers', teacher: 'teachers', student: 'students', box: 'boxes', bus: 'buses', watch: 'watches',
        baby: 'babies', city: 'cities', party: 'parties', man: 'men', woman: 'women', child: 'children', foot: 'feet', tooth: 'teeth'
    };
    const conjunctions = ['and', 'but', 'or', 'so', 'because'];
    // Simplified lists/concepts for Synonyms/Antonyms & Punctuation for now
    const synonymPairs = [{w1: 'happy', w2: 'glad'}, {w1: 'sad', w2: 'unhappy'}, {w1: 'big', w2: 'large'}, {w1: 'small', w2: 'tiny'}];
    const antonymPairs = [{w1: 'happy', w2: 'sad'}, {w1: 'big', w2: 'small'}, {w1: 'fast', w2: 'slow'}, {w1: 'loud', w2: 'quiet'}];
    const punctuationMarks = ['.', '?', '!'];
    
    // Additional verb forms for new tenses
    const futureSubjects = ['I', 'You', 'He', 'She', 'We', 'They', 'The cat', 'My friend'];
    const presentContinuousSubjects = ['I am', 'You are', 'He is', 'She is', 'It is', 
                                      'We are', 'They are', 'The cat is', 'My friend is'];


    // --- Helper Functions ---
    function getRandomElement(arr) {
        if (!arr || arr.length === 0) return null;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function shuffleArray(arr) {
        let newArr = [...arr]; // Create a copy to avoid modifying original
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    }

    function getVerbForm(subject, verbInfo, tense = 'present') {
         if (tense === 'present') {
             if (subject === 'I' || subject === 'You' || subject === 'We' || subject === 'They' || subject.includes('students') || subject.endsWith('s')) { // Crude plural check
                 return verbInfo.base;
             } else {
                 return verbInfo.s;
             }
         } else if (tense === 'past') {
             return pastVerbsMap[verbInfo.base] || `${verbInfo.base}ed`; // Default to adding 'ed' if not irregular
         }
         return verbInfo.base; // Default
    }

    // --- Exercise Template Functions (Expanded) ---

    function generateNounExercise() {
        const exerciseType = Math.floor(Math.random() * 2); // 0 o 1
        
        if (exerciseType === 0) {
            // Ejercicio de completar espacios
            const noun = getRandomElement([...commonNouns, ...properNouns]);
            const sentence = `The word "<b>${noun}</b>" is a ______ noun.`;
            const answer = properNouns.includes(noun) ? 'Proper' : 'Common';
            return { type: 'fill-blank', question: sentence, answer };
        } else {
            // Ejercicio multiple choice original
            const isProper = Math.random() > 0.5;
            const correctAnswer = isProper ? getRandomElement(properNouns) : getRandomElement(commonNouns);
            const question = `Is "<b>${correctAnswer}</b>" a Common Noun or a Proper Noun?`;
            const options = shuffleArray(['Common Noun', 'Proper Noun']);
            const answer = isProper ? 'Proper Noun' : 'Common Noun';
            return { type: 'multiple-choice', question, options, answer };
        }
    }

    function generateVerbExercise(tense = 'present') {
        const subject = getRandomElement(subjects);
        const verbKey = getRandomElement(baseVerbs);
        const verbInfo = presentVerbsMap[verbKey]; // Use present map to get base form info
        const correctAnswer = getVerbForm(subject, verbInfo, tense);
        const question = `${subject} ______ yesterday.`; // Adjust sentence based on tense if needed

        let incorrectOptions = [];
        if (tense === 'present') {
            incorrectOptions = [verbInfo.base === correctAnswer ? verbInfo.s : verbInfo.base]; // The other present form
            incorrectOptions.push(pastVerbsMap[verbKey] || `${verbKey}ed`); // A past form
        } else { // Past tense exercise
             incorrectOptions = [verbInfo.base, verbInfo.s]; // Present forms
        }

        // Add one more random distractor (different verb, maybe different tense)
        let distractorVerbKey = getRandomElement(baseVerbs.filter(k => k !== verbKey));
        incorrectOptions.push(Math.random() > 0.5 ? presentVerbsMap[distractorVerbKey].s : pastVerbsMap[distractorVerbKey] || `${distractorVerbKey}ed`);

        incorrectOptions = shuffleArray([...new Set(incorrectOptions.filter(opt => opt !== correctAnswer))]).slice(0, 2); // Unique, different from answer

        const options = shuffleArray([correctAnswer, ...incorrectOptions]);
        return { type: 'multiple-choice', question: `${subject} ______ . (${tense === 'past' ? 'Past Tense' : 'Present Tense'})`, options, answer: correctAnswer };
    }

    function generateAdjectiveExercise() {
        const noun = getRandomElement(commonNouns);
        const adjective = getRandomElement(adjectives);
        const question = `Which word is the adjective: The <b>${adjective}</b> ${noun} is nice.`;
        let incorrectOptions = [
            noun, // The noun itself
            presentVerbsMap[getRandomElement(baseVerbs)].base // A verb
        ];
        incorrectOptions = [...new Set(incorrectOptions.filter(opt => opt !== adjective))]; // Unique, not the adjective
        while (incorrectOptions.length < 2) { // Ensure 2 distractors
             let potentialOption = Math.random() > 0.5 ? getRandomElement(commonNouns) : presentVerbsMap[getRandomElement(baseVerbs)].base;
             if (potentialOption !== adjective && potentialOption !== noun && !incorrectOptions.includes(potentialOption)) {
                 incorrectOptions.push(potentialOption);
             }
         }
        const options = shuffleArray([adjective, ...incorrectOptions.slice(0,2)]);
        return { type: 'multiple-choice', question, options, answer: adjective };
    }

     function generatePronounExercise() {
        const nounToReplace = getRandomElement([...properNouns, ...commonNouns.filter(n => !n.includes(' '))]); // Avoid multi-word common nouns for simplicity
        const isSubject = Math.random() > 0.5;
        let pronounList = isSubject ? subjectPronouns : objectPronouns;
        // Simple mapping (needs improvement for accuracy, e.g., gender)
        let correctAnswer;
        if (['Sarah', 'She'].includes(nounToReplace)) correctAnswer = isSubject ? 'She' : 'her';
        else if (['David', 'He'].includes(nounToReplace)) correctAnswer = isSubject ? 'He' : 'him';
        else if (nounToReplace.endsWith('s')) correctAnswer = isSubject ? 'They' : 'them'; // Crude plural
        else correctAnswer = getRandomElement(pronounList); // Fallback

        const question = `Replace the bold word with a pronoun: ${isSubject ? `<b>${nounToReplace}</b> runs.` : `I see <b>${nounToReplace}</b>.`}`;
        let incorrectOptions = pronounList.filter(p => p !== correctAnswer);
        incorrectOptions = shuffleArray(incorrectOptions).slice(0, 2);
        const options = shuffleArray([correctAnswer, ...incorrectOptions]);
        return { type: 'multiple-choice', question, options, answer: correctAnswer };
    }

    function generateSentenceTypeExercise() {
        const type = getRandomElement(['Statement', 'Question', 'Command']);
        let sentence = '';
        let answer = type;
        switch (type) {
            case 'Statement': sentence = `The ${getRandomElement(commonNouns)} ${presentVerbsMap[getRandomElement(baseVerbs)].s}.`; break;
            case 'Question': sentence = `Did the ${getRandomElement(commonNouns)} ${getRandomElement(baseVerbs)}?`; break;
            case 'Command': sentence = `${getRandomElement(baseVerbs)}!`; break;
        }
        const question = `What type of sentence is this: "<b>${sentence}</b>"`;
        const options = shuffleArray(['Statement', 'Question', 'Command']);
        return { type: 'multiple-choice', question, options, answer };
    }

     function generatePluralNounExercise() {
        const singular = getRandomElement(Object.keys(pluralNounsMap));
        const correctAnswer = pluralNounsMap[singular];
        const question = `What is the plural of "<b>${singular}</b>"?`;
        let incorrectOptions = Object.values(pluralNounsMap).filter(p => p !== correctAnswer);
        incorrectOptions = shuffleArray(incorrectOptions).slice(0, 2);
        const options = shuffleArray([correctAnswer, ...incorrectOptions]);
        return { type: 'multiple-choice', question, options, answer: correctAnswer };
    }

    // Placeholder generators for complex topics
    function generateSynonymAntonymExercise() {
        const isSynonym = Math.random() > 0.5;
        const pair = isSynonym ? getRandomElement(synonymPairs) : getRandomElement(antonymPairs);
        const question = `Which word is ${isSynonym ? 'a synonym' : 'an antonym'} for "<b>${pair.w1}</b>"?`;
        const correctAnswer = pair.w2;
        let incorrectOptions = (isSynonym ? antonymPairs : synonymPairs)
                                .flatMap(p => [p.w1, p.w2]) // Get words from the *other* type of pair
                                .filter(w => w !== pair.w1 && w !== correctAnswer);
        incorrectOptions = shuffleArray([...new Set(incorrectOptions)]).slice(0, 2);
        const options = shuffleArray([correctAnswer, ...incorrectOptions]);
        return { type: 'multiple-choice', question, options, answer: correctAnswer };
    }

     function generateConjunctionExercise() {
        // Simple fill-in-the-blank structure
        const conj = getRandomElement(conjunctions);
        let sentence = '';
        switch(conj) {
            case 'and': sentence = `I like apples ______ bananas.`; break;
            case 'but': sentence = `He is small ______ strong.`; break;
            case 'or': sentence = `Do you want tea ______ coffee?`; break;
            case 'so': sentence = `It was raining, ______ I took an umbrella.`; break;
            case 'because': sentence = `She is happy ______ it's her birthday.`; break;
            default: sentence = `Sentence 1 ______ Sentence 2.`;
        }
        const question = `Choose the best conjunction: ${sentence}`;
        let incorrectOptions = conjunctions.filter(c => c !== conj);
        incorrectOptions = shuffleArray(incorrectOptions).slice(0, 2);
        const options = shuffleArray([conj, ...incorrectOptions]);
        return { type: 'multiple-choice', question, options, answer: conj };
    }

    function generatePunctuationExercise() {
        const mark = getRandomElement(punctuationMarks);
        let sentenceEnd = '';
        let questionText = 'Which punctuation mark should end this sentence: ';
        switch(mark) {
            case '.': sentenceEnd = `The cat sleeps`; questionText += `"${sentenceEnd}__"`; break;
            case '?': sentenceEnd = `Is the cat sleeping`; questionText += `"${sentenceEnd}__"`; break;
            case '!': sentenceEnd = `Wow`; questionText += `"${sentenceEnd}__"`; break;
        }
        const correctAnswer = mark;
        let incorrectOptions = punctuationMarks.filter(p => p !== correctAnswer);
        const options = shuffleArray([correctAnswer, ...incorrectOptions]);
        return { type: 'multiple-choice', question: questionText, options, answer: correctAnswer };
    }

    function generateFutureSimpleExercise() {
        const subject = getRandomElement(futureSubjects);
        const verbKey = getRandomElement(baseVerbs);
        const verbInfo = presentVerbsMap[verbKey];
        const correctAnswer = `will ${verbInfo.base}`;
        
        const question = `${subject} ______ tomorrow.`;
        let incorrectOptions = [
            `${verbInfo.base}`,
            `${verbInfo.s}`,
            `will ${verbInfo.s}`,
            `going to ${verbInfo.base}`
        ].filter(opt => opt !== correctAnswer);
        
        incorrectOptions = shuffleArray(incorrectOptions).slice(0, 2);
        const options = shuffleArray([correctAnswer, ...incorrectOptions]);
        return { type: 'multiple-choice', question, options, answer: correctAnswer };
    }

    function generatePresentContinuousExercise() {
        const subject = getRandomElement(presentContinuousSubjects);
        const verbKey = getRandomElement(baseVerbs);
        const verbInfo = presentVerbsMap[verbKey];
        const correctAnswer = `${verbInfo.base}ing`;
        
        const question = `${subject} ______ right now.`;
        let incorrectOptions = [
            `${verbInfo.base}`,
            `${verbInfo.s}`,
            `${verbInfo.base}ed`,
            `${verbInfo.base}s`
        ].filter(opt => opt !== correctAnswer);
        
        // Handle special cases for -ing forms
        if (verbKey.endsWith('e')) {
            incorrectOptions.push(`${verbKey.slice(0, -1)}ing`);
        }
        
        incorrectOptions = shuffleArray(incorrectOptions).slice(0, 2);
        const options = shuffleArray([correctAnswer, ...incorrectOptions]);
        return { type: 'multiple-choice', question, options, answer: correctAnswer };
    }

    // --- Data structure for units (Assigning Generators) ---
    const unitsData = [
        { title: '📚 Unidad 1: Sustantivos', contentHTML: `<p>Los sustantivos son palabras para personas, lugares, cosas o ideas.<br>Ejemplo: "<b>cat</b>" (gato), "<b>London</b>" (Londres)</p>`, exerciseGenerator: generateNounExercise },
        { title: '🏃 Unidad 2: Verbos (Presente)', contentHTML: `<p>Los verbos muestran acción o estado.<br>Estructura: I <b>run</b> (corro), He <b>runs</b> (corre)</p>`, exerciseGenerator: () => generateVerbExercise('present') },
        { title: '🎨 Unidad 3: Adjetivos', contentHTML: `<p>Describen sustantivos.<br>Ejemplo: "The <b>happy</b> cat" (El gato feliz)</p>`, exerciseGenerator: generateAdjectiveExercise },
        { title: '👤 Unidad 4: Pronombres', contentHTML: `<p>Reemplazan sustantivos.<br>Ejemplo: "<b>She</b> runs" (Ella corre) en vez de "Sarah runs"</p>`, exerciseGenerator: generatePronounExercise },
        { title: '❓ Unidad 5: Tipos de Oraciones', contentHTML: `<p>Una oración expresa un pensamiento completo.<br>Tipos: Declarativas, interrogativas, exclamativas</p>`, exerciseGenerator: generateSentenceTypeExercise },
        { title: '➕ Unidad 6: Plurales', contentHTML: `<p>Formas plurales de sustantivos.<br>Ejemplo: "cat" → "cats", "child" → "children"</p>`, exerciseGenerator: generatePluralNounExercise },
        { title: '⏳ Unidad 7: Verbos (Pasado)', contentHTML: `<p>Acciones en el pasado.<br>Ejemplo: "I <b>ran</b>" (corrí), "She <b>jumped</b>" (saltó)</p>`, exerciseGenerator: () => generateVerbExercise('past') },
        { title: '↔️ Unidad 8: Sinónimos & Antónimos', contentHTML: `<p>Palabras con significados similares/opuestos.<br>Ejemplo: "happy" = "glad", "happy" ≠ "sad"</p>`, exerciseGenerator: generateSynonymAntonymExercise },
        { title: '🔗 Unidad 9: Conjunciones', contentHTML: `<p>Unen palabras y oraciones.<br>Ejemplo: "I like tea <b>and</b> coffee"</p>`, exerciseGenerator: generateConjunctionExercise },
        { title: '✏️ Unidad 10: Puntuación', contentHTML: `<p>Signos para terminar oraciones.<br>".", "?", "!" - Ejemplo: "How are you<b>?</b>"</p>`, exerciseGenerator: generatePunctuationExercise },
        { title: '🚀 Unidad 11: Futuro Simple (will)', contentHTML: `<p>Acciones futuras con "will + verbo".<br>Ejemplo: "I <b>will eat</b>" (comeré)</p>`, exerciseGenerator: generateFutureSimpleExercise },
        { title: '⏱️ Unidad 12: Presente Continuo', contentHTML: `<p>Acciones en este momento (-ing).<br>Estructura: "am/is/are + verbo-ing"<br>Ejemplo: "She <b>is running</b>" (está corriendo)</p>`, exerciseGenerator: generatePresentContinuousExercise },
    ];

    // --- HTML Generation and Event Handling ---

    function generateExerciseHTML(exercise, uniqueIndex) {
        const questionNumber = parseInt(uniqueIndex.split('-')[1]) + 1;
        
        if (exercise.type === 'fill-blank') {
            return `
                <div class="exercise" id="exercise-container-${uniqueIndex}">
                    <h3>✏️ Ejercicio ${questionNumber}</h3>
                    <p>${exercise.question.replace('______', `<input type="text" name="exercise-${uniqueIndex}" id="input-${uniqueIndex}">`)}</p>
                    <button type="button" id="check-btn-${uniqueIndex}">Comprobar</button>
                    <div class="feedback-controls">
                        <p id="feedback-${uniqueIndex}" class="feedback"></p>
                        <button class="refresh-single-btn" id="refresh-btn-${uniqueIndex}" style="display: none;">🔄 Otra Pregunta</button>
                    </div>
                </div>
            `;
        } else {
            let optionsHTML = exercise.options.map((option) => `
                <label><input type="radio" name="exercise-${uniqueIndex}" value="${option}"> ${option}</label><br>
            `).join('');

            return `
                <div class="exercise" id="exercise-container-${uniqueIndex}">
                    <h3>✏️ Ejercicio ${questionNumber}</h3>
                    <p>${exercise.question}</p>
                    <form id="exercise-form-${uniqueIndex}">
                        ${optionsHTML}
                        <button type="submit">Comprobar</button>
                    </form>
                    <div class="feedback-controls">
                        <p id="feedback-${uniqueIndex}" class="feedback"></p>
                        <button class="refresh-single-btn" id="refresh-btn-${uniqueIndex}" style="display: none;">🔄 Otra Pregunta</button>
                    </div>
                </div>
            `;
        }
    }

    function checkAnswer(uniqueIndex, userAnswer) {
        const exerciseIndex = parseInt(uniqueIndex.split('-')[1]);
        const exercise = currentUnitExercises[exerciseIndex];
        const feedbackElement = document.getElementById(`feedback-${uniqueIndex}`);
        
        feedbackElement.className = 'feedback';
        
        if (userAnswer.toLowerCase() === exercise.answer.toLowerCase()) {
            feedbackElement.innerHTML = '✅ ¡Correcto!';
            feedbackElement.classList.add('correct');
        } else {
            feedbackElement.innerHTML = `❌ Casi. La respuesta correcta es "<b>${exercise.answer}</b>".`;
            feedbackElement.classList.add('incorrect');
        }
    }

    function checkFillBlank(uniqueIndex) {
        const input = document.getElementById(`input-${uniqueIndex}`);
        const feedbackElement = document.getElementById(`feedback-${uniqueIndex}`);
        const refreshButton = document.getElementById(`refresh-btn-${uniqueIndex}`);
        
        if (!input || !input.value.trim()) {
            feedbackElement.textContent = '🤔 Por favor escribe una respuesta.';
            feedbackElement.className = 'feedback prompt';
            return;
        }

        checkAnswer(uniqueIndex, input.value);
        input.disabled = true;
        
        const button = document.querySelector(`#exercise-container-${uniqueIndex} button`);
        if (button) {
            button.disabled = true;
        }
        
        if (refreshButton) {
            refreshButton.style.display = 'inline-block';
        }
    }

    function handleMultipleChoiceSubmit(event, uniqueIndex) {
        event.preventDefault();
        const form = event.target;
        const feedbackElement = document.getElementById(`feedback-${uniqueIndex}`);
        const refreshButton = document.getElementById(`refresh-btn-${uniqueIndex}`);
        const selectedAnswer = form.querySelector(`input[name="exercise-${uniqueIndex}"]:checked`);

        const exerciseIndex = parseInt(uniqueIndex.split('-')[1]);
        const exercise = currentUnitExercises[exerciseIndex];
        if (!exercise) return;

        feedbackElement.className = 'feedback';

        if (selectedAnswer) {
            checkAnswer(uniqueIndex, selectedAnswer.value);
            form.querySelectorAll('input[type="radio"]').forEach(input => input.disabled = true);
            form.querySelector('button').disabled = true;
            refreshButton.style.display = 'inline-block';
        } else {
            feedbackElement.textContent = '🤔 Por favor selecciona una respuesta.';
            feedbackElement.classList.add('prompt');
            refreshButton.style.display = 'none';
        }
    }

    // Function to refresh a single exercise
    function refreshSingleExercise(event, uniqueIndex) {
        event.preventDefault();
        if (!currentUnitData || !currentUnitData.exerciseGenerator) return;

        const exerciseIndex = parseInt(uniqueIndex.split('-')[1]);
        const newExercise = currentUnitData.exerciseGenerator(); // Generate a new one
        currentUnitExercises[exerciseIndex] = newExercise; // Update the stored exercise data

        // Regenerate HTML for this specific exercise
        const newExerciseHTML = generateExerciseHTML(newExercise, uniqueIndex);

        // Replace the old exercise container with the new one
        const exerciseContainer = document.getElementById(`exercise-container-${uniqueIndex}`);
        if (exerciseContainer) {
            // Create a temporary div to parse the new HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newExerciseHTML.trim();
            const newExerciseElement = tempDiv.firstChild;

            // Replace the old element with the new one
            exerciseContainer.parentNode.replaceChild(newExerciseElement, exerciseContainer);

            // Re-attach event listeners based on exercise type
            if (newExercise.type === 'multiple-choice') {
                const newForm = document.getElementById(`exercise-form-${uniqueIndex}`);
                if (newForm) {
                    newForm.addEventListener('submit', (e) => handleMultipleChoiceSubmit(e, uniqueIndex));
                }
            } else {
                const newButton = document.querySelector(`#exercise-container-${uniqueIndex} button`);
                if (newButton) {
                    newButton.onclick = () => checkFillBlank(uniqueIndex);
                }
            }
            
            // Re-attach refresh button listener
            const newRefreshButton = document.getElementById(`refresh-btn-${uniqueIndex}`);
            if (newRefreshButton) {
                newRefreshButton.addEventListener('click', (e) => refreshSingleExercise(e, uniqueIndex));
            }
        }
    }


    function populateNav() {
        const navList = document.querySelector('nav ul');
        navList.innerHTML = '';
        unitsData.forEach((unit, index) => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = unit.title;
            link.addEventListener('click', (event) => loadUnitContent(event, index));
            listItem.appendChild(link);
            navList.appendChild(listItem);
        });
    }

    function loadUnitContent(event, unitIndex) {
         if(event) event.preventDefault(); // Prevent default only if event exists (not on initial load)
         currentUnitData = unitsData[unitIndex]; // Store current unit data
         currentUnitExercises = [];
         let exercisesHTML = '';
         const numExercises = 10;

         if (currentUnitData.exerciseGenerator) {
             for (let i = 0; i < numExercises; i++) {
                 const exercise = currentUnitData.exerciseGenerator();
                 currentUnitExercises.push(exercise);
                 const uniqueIndex = `${unitIndex}-${i}`;
                 exercisesHTML += generateExerciseHTML(exercise, uniqueIndex);
             }
         } else {
             // Handle units without generators (e.g., show fixed or message)
             // For now, just show message if no generator
             exercisesHTML = '<p>Dynamic exercises not available for this unit yet.</p>';
         }

        const headingTitle = currentUnitData.title.substring(currentUnitData.title.indexOf(' ') + 1);
        // Add the "New Full Test" button HTML
        const refreshAllButtonHTML = `<div class="refresh-all-container"><button id="refresh-all-btn">🔄 Nuevo Test Completo</button></div>`;

        contentSection.innerHTML = `<h2>${headingTitle}</h2>${currentUnitData.contentHTML}${exercisesHTML}${refreshAllButtonHTML}`;

        // Add event listeners AFTER innerHTML is set
        currentUnitExercises.forEach((exercise, i) => {
            const uniqueIndex = `${unitIndex}-${i}`;
            const form = document.getElementById(`exercise-form-${uniqueIndex}`);
            const refreshButton = document.getElementById(`refresh-btn-${uniqueIndex}`);
            if (form && exercise.type === 'multiple-choice') {
                 form.addEventListener('submit', (e) => handleMultipleChoiceSubmit(e, uniqueIndex));
            }
            // Set up event listeners for both exercise types
            const checkButton = document.getElementById(`check-btn-${uniqueIndex}`);
            if (checkButton) {
                checkButton.onclick = () => checkFillBlank(uniqueIndex);
            }
            
            if (refreshButton) {
                refreshButton.addEventListener('click', (e) => refreshSingleExercise(e, uniqueIndex));
            }
        });

        // Add listener for the "New Full Test" button
        const refreshAllButton = document.getElementById('refresh-all-btn');
        if (refreshAllButton) {
            // Pass null for event, and the current unitIndex
            refreshAllButton.addEventListener('click', () => loadUnitContent(null, unitIndex));
        }
    }

    // --- Initial Setup ---
    populateNav();
    if (unitsData.length > 0) {
        loadUnitContent(null, 0); // Load unit 0 initially without event
    }
});
