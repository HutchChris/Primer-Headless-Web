 //import { Primer } from '@primer-io/checkout-web';

window.addEventListener('load', onLoaded)

async function onLoaded() {
    // Create a client session via your backend
    const clientSession = await fetch('/client-session', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
    }).then(data => data.json())

    const { clientToken } = clientSession
    const { Primer } = window
    
    console.log(clientToken)
    // Create an instance of the headless checkout
    const headless = await Primer.createHeadless(clientToken)

    const container = document.getElementById("payment-container")
    console.log(container)
    
    // Configure headless
    await headless.configure({
    onAvailablePaymentMethodsLoad,
    onPaymentCreationStart,
    onCheckoutComplete,
    onCheckoutFail
    });

    const addLoadingSpinner = () => {
        const loadingSpinner = document.createElement("div");
        loadingSpinner.setAttribute("id", "loading-spinner");
        loadingSpinner.setAttribute("class", "loading-spinner");
        container.append(loadingSpinner);
      
        const loadingSpinnerDiv = document.createElement("div");
        loadingSpinnerDiv.setAttribute("class", "loading-div");
        container.append(loadingSpinnerDiv);
      };
      
      const removeLoadingSpinner = () => {
        container.querySelector("#loading-spinner").remove();
        container.querySelector(".loading-div").remove();
      };

    
    
    async function onAvailablePaymentMethodsLoad(paymentMethodTypes) {
        // Called when the available payment methods are retrieved
        console.log("Available Payment Methods:", paymentMethodTypes);
    
        for (const paymentMethodType of paymentMethodTypes) {
          switch (paymentMethodType) {
            case 'PAYMENT_CARD': {
              //headless web UI config
             
    
              // Create containers for your hosted inputs
              const cardNumberInputId = 'checkout-card-number-input'
              const cardNumberInputEl = document.createElement('div')
              cardNumberInputEl.setAttribute('id', cardNumberInputId)
              cardNumberInputEl.setAttribute('class','primer-fields')
              
    
              const cardExpiryInputId = 'checkout-card-expiry-input'
              const cardExpiryInputEl = document.createElement('div')
              cardExpiryInputEl.setAttribute('id', cardExpiryInputId)
              cardExpiryInputEl.setAttribute('class','primer-fields')
              
    
              const cardCvvInputId = 'checkout-card-cvv-input'
              const cardCvvInputEl = document.createElement('div')
              cardCvvInputEl.setAttribute('id', cardCvvInputId)
              cardCvvInputEl.setAttribute('class','primer-fields')
              
    
              const cardHolderInputId = 'primer-checkout-card-cardholder-name-input'
              const cardHolderInputEl = document.createElement('input')
              cardHolderInputEl.setAttribute('id', cardHolderInputId)
              cardHolderInputEl.setAttribute('placeholder', 'Cardholder Name')
              cardHolderInputEl.setAttribute('class','primer-fields')
    
              const submitButton = document.createElement('input')
              const buttonId = 'submit-button'
              submitButton.setAttribute('type', 'button')
              submitButton.setAttribute('id', buttonId)
              submitButton.setAttribute('class','primer-fields')
              submitButton.value = 'Submit'
    
              // Add them to your container
              container.append(cardHolderInputEl,cardNumberInputEl, cardExpiryInputEl, cardCvvInputEl,submitButton)
    
              async function configureCardForm() {

                const style = {
                    input: {
                        base: {
                            height: 'auto',
                            border: '1px solid rgb(0 0 0 / 10%)',
                            borderRadius: '2px',
                            padding: '12px',
                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                        },
                    },
                }

                // Create the payment method manager
                const cardManager = await headless.createPaymentMethodManager('PAYMENT_CARD', {onCardMetadataChange({type}) {
                    console.log('Card type: ', type)
                  },
                })
    
                // Create the hosted inputs
                const cardNumberInput = cardManager.createHostedInput('cardNumber')
                const cvvInput = cardManager.createHostedInput('cvv')
                const expiryInput = cardManager.createHostedInput('expiryDate')

                await Promise.all([
                  cardNumberInput.render(cardNumberInputId, {
                    placeholder: '1234 1234 1234 1234',
                    ariaLabel: 'Card number',
                    styles: style,
                  }),
                  expiryInput.render(cardExpiryInputId, {
                    placeholder: 'MM/YY',
                    ariaLabel: 'Expiry date',
                    styles: style,
                  }),
                  cvvInput.render(cardCvvInputId, {
                    placeholder: '123',
                    ariaLabel: 'CVV',
                    styles: style,
                  }),
                ])
    
                // Set the cardholder name if it changes
                document.getElementById(cardHolderInputId).addEventListener('change', e => {cardManager.setCardholderName(e.target.value)})
    
                // Configure event listeners for supported events
                cardNumberInput.addEventListener('change', (...args) => {console.log('cardNumberInput changed', ...args)
})
    
                cardNumberInput.focus()
    
                submitButton.addEventListener('click', async () => {
                  // Validate your card input data
                  const { valid } = await cardManager.validate()
                  console.log('Submit Valid?', valid)
    
                  if (valid) {
                    console.log('All is valid')
    
                    // Submit the card input data to Primer for tokenization
                    await cardManager.submit()
                  }
                })
              }
    
              await configureCardForm();

              break;
    
            }
            case 'PAYPAL': {
                const paymentMethodManager = await headless.createPaymentMethodManager('PAYPAL')

                const container = document.getElementById("payment-container")

                // Create the button container
                const payPalButton = document.createElement('div')
                const payPalButtonId = 'paypal-button'
                payPalButton.setAttribute('type', 'button')
                payPalButton.setAttribute('id', payPalButtonId)

                container.append(payPalButton);
                
                // Create and render the button
                const button = paymentMethodManager.createButton();
                button.render(payPalButtonId, {
                    buttonColor: 'silver'
                });

                // configurePayPalButton();
                break;
            }
            case 'APPLE_PAY': {
                const paymentMethodManager = await headless.createPaymentMethodManager('APPLE_PAY')

                const container = document.getElementById("payment-container")

                // Create the button container
                const applePayButton = document.createElement('div')
                const applePayButtonId = 'apple-pay-button'
                applePayButton.setAttribute('type', 'button')
                applePayButton.setAttribute('id', applePayButtonId)

                container.append(applePayButton);
                
                // Create and render the button
                const button = paymentMethodManager.createButton();
                button.render(applePayButtonId, {
                    buttonColor: 'white'
                });

                // configureApplePayButton();
                break;
            }
            case 'GOOGLE_PAY': {
                const paymentMethodManager = await headless.createPaymentMethodManager('GOOGLE_PAY')

                const container = document.getElementById("payment-container")

                // Create the button container
                const googlePayButton = document.createElement('div')
                const googlePayButtonId = 'google-pay-button'
                googlePayButton.setAttribute('type', 'button')
                googlePayButton.setAttribute('id', googlePayButtonId)

                container.append(googlePayButton);
                
                // Create and render the button
                const button = paymentMethodManager.createButton();
                button.render(googlePayButtonId, {
                    buttonColor: 'white'
                });

               
                break;
            }
            // More payment methods to follow
        }
    }
}
       function onPaymentCreationStart() {
        console.log("onPaymentCreationStart");
        addLoadingSpinner();
  }


       function onCheckoutComplete({ payment }) {
            // Notifies you that a payment was created
            // Move on to next step in your checkout flow:
            // e.g. Show a success message, giving access to the service, fulfilling the order, ...
            console.log('onCheckoutComplete', payment)
            removeLoadingSpinner();
            //cardManager.removeHostedInputs();

            window.location.href = "checkoutConfirmation.html";

     
        }

        function onCheckoutFail(error, { payment }, handler) {

            removeLoadingSpinner();
            // Notifies you that the checkout flow has failed and a payment could not be created
            // This callback can also be used to display an error state within your own UI.

            // ⚠️ `handler` is undefined if the SDK does not expect anything from you
            if (!handler) {
                return
            }

            // ⚠️ If `handler` exists, you MUST call one of the functions of the handler

            // Show a default error message
            return handler.showErrorMessage()
        }


    

  
    // Start the headless checkout
    await headless.start()

    console.log('Headless Universal Checkout is loaded!')
}