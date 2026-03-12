/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('front.js missing-error-test', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div class="edit-course-view-button active">Edit List</div>
      <div class="ld-item-list ld-course-list">
        <div class="ld-item-list-items"></div>
        <div class="ld-item-list-items"></div>
      </div>
    `;

    // Reset jQuery
    const $ = require('jquery');
    global.$ = $;
    global.jQuery = $;
    window.$ = $;
    window.jQuery = $;

    // Some basic setup missing for jQuery + jsdom context
    $.support = $.support || {};
    $.support.cors = true;

    // We need to define matchMedia if it is used globally in front.js
    window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }));

    window.isMobile = jest.fn().mockReturnValue(false);

    // Reset usermeta
    window.usermeta = {
      hiddenCoursesInDB: [[]],
      hiddenCheckedCourses: ['course1'],
      ajaxurl: '/wp-admin/admin-ajax.php'
    };
    global.usermeta = window.usermeta;

    // Load the script
    const scriptPath = path.resolve(__dirname, 'front.js.download');
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');

    // Evaluate script in the current jsdom context
    eval(scriptContent);

    // prevent JSDOM reload error
    delete window.location;
    window.location = { reload: jest.fn() };
  });

  afterEach(() => {
    jest.resetModules();
    document.body.innerHTML = '';
  });

  it('should show Oops! popup when ajax fails', async () => {
    // Mock jQuery.ajax
    const mockAjax = jest.spyOn(global.jQuery, 'ajax').mockImplementation(() => {
      return {
        then: function(cb) {
            cb({ status: 'error' });
            return this;
        }
      }
    });

    // Manually trigger the ready handler by dispatching event if it's queued
    global.jQuery.ready();
    await new Promise(resolve => setTimeout(resolve, 10));

    // Trigger click
    global.jQuery('.edit-course-view-button').trigger('click');

    // Wait for the next tick to allow the promise to resolve
    await new Promise(resolve => setTimeout(resolve, 10));

    // Verify popup was created with correct message
    const popupTitle = global.jQuery('.popup-title').text().trim();
    const popupMessage = global.jQuery('.popup-message').text().trim();

    expect(popupTitle).toBe('Oops!');
    expect(popupMessage).toBe('Something went wrong. Please try again.');

    mockAjax.mockRestore();
  });
});
