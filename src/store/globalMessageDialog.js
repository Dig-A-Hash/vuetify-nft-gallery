/**
 * This Pinia Store is used to display all global messages.
 * This includes actions for handling exceptions, display
 * messages, and displaying a progress spinner.
 */

import { defineStore } from 'pinia';

export const useGlobalMessageDialogStore = defineStore(
  'globalMessageDialogStore',
  {
    state: () => ({
      isShowing: false,
      title: 'Error Message',
      message: 'There was an error.',
      titleClass: 'styles-bg-dark-red',
      progressSpinner: {
        isShowing: false,
        message: 'Please wait...',
      },
    }),
    getters: {},
    actions: {
      showProgressSpinner(message) {
        this.progressSpinner.message = message;
        this.progressSpinner.isShowing = true;
      },
      hideProgressSpinner() {
        this.progressSpinner.message = 'Complete!';
        setTimeout(() => {
          this.progressSpinner.isShowing = false;
          setTimeout(() => {
            this.progressSpinner.message = 'Please wait...';
          }, 500);
        }, 500);
      },
      /**
       * Handles an exception anywhere in the application.
       * @param {object} ex - The exception object.
       */
      handleException(ex) {
        console.log('Exception Handler');
        if (ex) {
          console.log(ex);
        }

        this.titleClass = 'styles-bg-dark-red';

        if (ex?.name === 'AxiosError' && ex?.response?.status === 400) {
          // This is a form validation error.

          if (ex?.response?.data?.message) {
            this.message = `${ex.response.statusText}, ${ex.response.data.message}.`;
          } else {
            this.message = `${ex.response.statusText} - ${ex.message}`;
          }

          this.title = `Form Validation Error`;

          this.isShowing = true;
        } else {
          this.message = `${ex?.message}${ex?.response?.data ? ' - ' + ex?.response?.data : ''
            }`;
          this.title = `ERROR`;
          this.isShowing = true;
        }
      },

      /**
       * Send a message to the global message dialog.
       * @param {string} message - The message to display.
       * @param {string} title -  The dialog title to display. Defaults to 'System Message'.
       * @param {string} titleClass - The title class to use. Defaults to 'bg-primary'.
       */
      sendMessage(message, title, titleClass) {
        this.message = `${message}`;

        if (title) {
          this.title = `${title}`;
        } else {
          this.title = 'System Message';
        }

        if (titleClass) {
          this.titleClass = `${titleClass}`;
        } else {
          this.titleClass = 'bg-primary';
        }

        this.isShowing = true;
      },
    },
  }
);
