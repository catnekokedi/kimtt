/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const $ = require('jquery');

describe('Tab navigation state updates', () => {
    let scriptContent;

    beforeAll(() => {
        const scriptPath = path.resolve(__dirname, '../Level 7/Lesson 10. Sentence Building Drill 9 – Learn Korean with Talk To Me In Korean_files/custom.js.download');
        scriptContent = fs.readFileSync(scriptPath, 'utf8');
        global.jQuery = $;
    });

    beforeEach(() => {
        // Clear all previous event listeners on document
        $(document).off();

        document.body.innerHTML = `
            <div class="ld-tabs-navigation">
                <div class="ld-tab ld-active" data-tab="lesson">Dialogue</div>
                <div class="ld-tab" data-tab="custom1">Vocabulary</div>
                <div class="ld-tab" data-tab="custom3">Grammar</div>
                <div class="ld-tab" data-tab="other">Other</div>
            </div>
            <div class="ld-tabs-content">
                <div class="ld-tab-content tab-content-lesson">
                    <iframe src="dialogue.html"></iframe>
                </div>
                <div class="ld-tab-content tab-content-custom1" style="display:none">
                    <iframe src="vocabulary.html"></iframe>
                </div>
                <div class="ld-tab-content tab-content-custom3" style="display:none">
                    <iframe src="grammar.html"></iframe>
                </div>
                <div class="ld-tab-content tab-content-other" style="display:none">
                    <iframe src="other.html"></iframe>
                </div>
            </div>
        `;

        console.log = jest.fn();

        // Run the script. The script adds a document.ready listener.
        // In JSDOM and jQuery combo, simply doing eval(scriptContent) and $(document).ready()
        // sometimes doesn't execute the callback.
        // We bypass the regex by extracting the inner function and calling it with a wrapper or
        // passing it to jQuery(document).ready() manually using a trick.

        // Actually, if we just execute it normally, we need to ensure jQuery's ready is triggered.
        // Let's redefine jQuery(document).ready to execute immediately
        const originalReady = $.fn.ready;
        $.fn.ready = function(callback) {
            callback();
            return this;
        };

        eval(scriptContent);

        $.fn.ready = originalReady;
    });

    it('should set initial state correctly', () => {
        expect($("div.ld-tab").length).toBe(4);
    });

    it('should trigger script execution correctly', () => {
        const $custom1 = $("div.ld-tab[data-tab='custom1']");
        $custom1.click();
        expect(console.log).toHaveBeenCalledWith('Prd.v2310.1');
    });

    describe('Class and Display Toggling', () => {
        it('should switch active class to clicked tab and remove from others', () => {
            $("div.ld-tab[data-tab='custom1']").click();

            expect($("div.ld-tab[data-tab='custom1']").hasClass('ld-active')).toBe(true);
            expect($("div.ld-tab[data-tab='lesson']").hasClass('ld-active')).toBe(false);
            expect($("div.ld-tab[data-tab='custom3']").hasClass('ld-active')).toBe(false);
        });

        it('should display the content of the clicked tab and hide others', () => {
            $("div.ld-tab[data-tab='custom1']").click();

            expect($(".tab-content-lesson").css("display")).toBe("none");
            expect($(".tab-content-custom1").css("display")).not.toBe("none");
            expect($(".tab-content-custom3").css("display")).toBe("none");
        });
    });

    describe('Iframe Source Switching (Grammar|Vocabulary|Dialogue)', () => {
        it('should set correct iframe src when custom1 (Vocabulary) is clicked', () => {
            $("div.ld-tab[data-tab='custom1']").click();

            // Custom1 iframe gets its src
            expect($(".tab-content-custom1 iframe").attr("src")).toBe("vocabulary.html");
            // Others get empty src
            expect($(".tab-content-lesson iframe").attr("src")).toBe("");
            expect($(".tab-content-custom3 iframe").attr("src")).toBe("");
        });

        it('should set correct iframe src when custom3 (Grammar) is clicked', () => {
            $("div.ld-tab[data-tab='custom3']").click();

            // Custom3 iframe gets its src
            expect($(".tab-content-custom3 iframe").attr("src")).toBe("grammar.html");
            // Others get empty src
            expect($(".tab-content-lesson iframe").attr("src")).toBe("");
            expect($(".tab-content-custom1 iframe").attr("src")).toBe("");
        });

        it('should set correct iframe src when lesson (Dialogue) is clicked after another tab', () => {
            // First click something else
            $("div.ld-tab[data-tab='custom1']").click();

            // Then click lesson
            $("div.ld-tab[data-tab='lesson']").click();

            // Lesson iframe gets its src back
            expect($(".tab-content-lesson iframe").attr("src")).toBe("dialogue.html");
            // Others get empty src
            expect($(".tab-content-custom1 iframe").attr("src")).toBe("");
            expect($(".tab-content-custom3 iframe").attr("src")).toBe("");
        });
    });

    describe('Iframe Source Switching (Other tabs)', () => {
        it('should clear lesson and custom1 iframe src when "Other" is clicked', () => {
            $("div.ld-tab[data-tab='other']").click();

            expect($(".tab-content-lesson iframe").attr("src")).toBe("");
            expect($(".tab-content-custom1 iframe").attr("src")).toBe("");
            expect($(".tab-content-custom3 iframe").attr("src")).toBe("grammar.html"); // custom3 is untouched in else block
        });

        it('should restore lesson iframe src when lesson is clicked after "Other"', () => {
            $("div.ld-tab[data-tab='other']").click();

            // Modify text to not match Grammar|Vocabulary|Dialogue to trigger else branch
            $(".ld-tab[data-tab='lesson']").text("Not Dialogue");
            $("div.ld-tab[data-tab='lesson']").click();

            expect($(".tab-content-lesson iframe").attr("src")).toBe("dialogue.html");
        });

        it('should restore custom1 iframe src when custom1 is clicked after "Other"', () => {
            $("div.ld-tab[data-tab='other']").click();

            // Modify text to not match Grammar|Vocabulary|Dialogue to trigger else branch
            $(".ld-tab[data-tab='custom1']").text("Not Vocab");
            $("div.ld-tab[data-tab='custom1']").click();

            expect($(".tab-content-custom1 iframe").attr("src")).toBe("vocabulary.html");
        });
    });
});
