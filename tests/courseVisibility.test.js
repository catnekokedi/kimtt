const fs = require('fs');
const path = require('path');

describe('Course Visibility View Toggling', () => {
  let $;

  beforeEach(() => {
    // Basic setup using built-in JSDOM from jest-environment-jsdom
    document.body.innerHTML = `
      <div class="ld-item-list ld-course-list"></div>
      <div class="ld-item-list ld-course-list"></div>
      <div class="ld-item-list-items"></div>
      <div class="ld-item-list-items">
        <div class="ld-item-list-container"></div>
        <div class="ld-item-list-container is-hidden"></div>
      </div>

      <div class="view-button">
        <div class="view-active premium-courses-view-selector" data-value="Premium Courses">Premium Courses</div>
        <div class="view-inactive hidden-courses-view-selector" data-value="Hidden Courses">Hidden Courses</div>
        <div class="invalid-selector">Invalid</div>
      </div>
    `;

    $ = require('jquery');
    global.jQuery = global.$ = $;

    // Stub the custom function added later in the script
    $.fn.inputFilter = function() { return this; };

    // Mock environment variables
    global.matchMedia = () => ({ matches: false });
    global.isMobile = () => false;
    global.usermeta = {
      hiddenCoursesInDB: [],
      hiddenCheckedCourses: [],
      ajaxurl: '/wp-admin/admin-ajax.php'
    };

    // Load and evaluate script
    const scriptPath = path.resolve(__dirname, '../Level 7/Lesson 10. Sentence Building Drill 9 – Learn Korean with Talk To Me In Korean_files/front.js.download');
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');

    // Wrap to catch the ready function but mock the document ready
    eval(`
      var originalReady = $.fn.ready;
      $.fn.ready = function(callback) {
        if (callback) {
          callback();
        }
        return this;
      };

      ${scriptContent}

      $.fn.ready = originalReady;
    `);
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should ignore clicks on elements without a valid data-value', () => {
    const $activeBefore = $('.view-active');
    const $inactiveBefore = $('.view-inactive');

    // Create an element without data-value
    $('.view-button').append('<div class="premium-courses-view-selector no-value"></div>');
    $('.no-value').trigger('click');

    expect($('.view-active').data('value')).toBe($activeBefore.data('value'));
    expect($('.view-inactive').data('value')).toBe($inactiveBefore.data('value'));
  });

  it('should toggle classes when clicking inactive value', () => {
    $('.hidden-courses-view-selector').trigger('click');

    const $newActive = $('.view-active').eq(0);
    const $newInactive = $('.view-inactive').eq(0);

    expect($newActive.data('value')).toBe('Hidden Courses');
    expect($newInactive.data('value')).toBe('Premium Courses');
    expect($('.ld-item-list.ld-course-list').eq(1).hasClass('hidden-course-view')).toBe(true);
  });

  it('should do nothing when clicking the already active value', () => {
    $('.premium-courses-view-selector').trigger('click');

    const $newActive = $('.view-active').eq(0);
    const $newInactive = $('.view-inactive').eq(0);

    expect($newActive.data('value')).toBe('Premium Courses');
    expect($newInactive.data('value')).toBe('Hidden Courses');
    expect($('.ld-item-list.ld-course-list').eq(1).hasClass('hidden-course-view')).toBe(false);
  });

  it('should only toggle the first match of active and inactive buttons', () => {
    // Add multiple active and inactive buttons
    $('.view-button').append('<div class="view-active premium-courses-view-selector second-active" data-value="Premium Courses">Premium Courses 2</div>');
    $('.view-button').append('<div class="view-inactive hidden-courses-view-selector second-inactive" data-value="Hidden Courses">Hidden Courses 2</div>');

    // Click the inactive button
    $('.hidden-courses-view-selector').eq(0).trigger('click');

    // Check that ONLY the first active/inactive buttons were toggled
    // The previously active first button should be inactive
    expect($('.premium-courses-view-selector').eq(0).hasClass('view-inactive')).toBe(true);
    // The previously inactive first button should be active
    expect($('.hidden-courses-view-selector').eq(0).hasClass('view-active')).toBe(true);

    // The second buttons should remain unchanged because .eq(0) is used in the script
    expect($('.second-active').hasClass('view-active')).toBe(true);
    expect($('.second-inactive').hasClass('view-inactive')).toBe(true);
  });
});
