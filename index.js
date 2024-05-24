// -------GETTING ELEMENTS FROM DOM---------------
const dropDownCustom = document.getElementById("drop-down-custom-container")
const optionsContainer = document.getElementById("options-container")
const btnCustomScheme = document.getElementById('btn-scheme')
const colorsContainer = document.getElementById('clrs-container')
const copiedToClipBoardText = document.getElementById("copied")
// ! I really wanna get rid of these dom elements but there is a problem with api and function calls because of the (e/event)
const pickedClr = document.getElementById('input-pickedClr')
const numberOfClrs = document.getElementById("input-clrs-range")

// ----------GLOBAL VARIABLES--------------------
let scheme = "monochrome"

//-------EVENT LISTENERS--------------------------
// to change the numbers of colors in input range according the the user's input
// ! example code
// document.getElementById("input-clrs-range").addEventListener("input", e => getNumber(e))
// function getNumber(el) {
//     el.target.previousElementSibling.value = `${el.target.value} colors`
//     el.target.value
// }

pickedClr.addEventListener('input', () => pickedClr.value)
numberOfClrs.addEventListener("input", displayNumbers)

// to close the custom select input when clicked outside of it
// ? I was trying to use a different element but I couldn't manage to make it work 
// ? unless I used document, is it okay? I have a feeling it's not a good solution to have 
// ? eventListener on a document
// document.addEventListener("click", (e) => {
//     const dropdownCustomDimensions =dropDownCustom.getBoundingClientRect()  
//     if(
//         e.clientX < dropdownCustomDimensions.left || 
//         e.clientX > dropdownCustomDimensions.right || 
//         e.clientY < dropdownCustomDimensions.top || 
//         e.clientY > dropdownCustomDimensions.bottom
//     ) {
//       document.querySelector(".drop-down-custom-container > ul").classList.add("hidden-display")
//     }
//   })

document.addEventListener("click", (e) => closeCustomSelectWhenClickedOutside(e))
  
dropDownCustom.addEventListener("click", (e) => {
    optionsContainer.innerHTML = displayCustomSelectOptions()
    optionsContainer.classList.toggle("hidden-display")
    displaySelectedOption(e)
    changeSchemeValueWhenClicked(e)
})

document.getElementById('btn-generate-clrs').addEventListener('click', async () => {
    colorsContainer.innerHTML = `${await generateHTML(getColorsFromApi()) }`
})

colorsContainer.addEventListener("click" , (e) => {
    copyHexToClipboard(e)
})

// -----------FUNCTION DECLARATIONS---------------------------
function displayCustomSelectOptions() {
    const options = ["Monochrome", "Monochrome-dark", "Monochrome-light", "Analogic", "Complement", "Analogic-complement", "Triad"]
    let optionItems = " "
    options.forEach((option) => {
        optionItems +=  `<li class="option"> ${option} </li>`
    })
    return optionItems
  }

// ? What is better to use a static NodeList or live HTML collection?
// ? As I need to iterate over the list, NodeList seems a better option, however, it says in the docs that NodeList is static, 
// ? so then HTML collection seems a better option as it's live and gets changed but I'll need 
// ? to use Array.from in order to iterare over it. So it's quite confusing, any advice? 

function displaySelectedOption(el) {
    Array.from(optionsContainer).forEach((option) => {
        option.classList.contains("selected") ? option.classList.remove("selected") : null
    })
    el.target.className === "option" ?  el.target.classList.add("selected") : null
        if(el.target.classList.contains("selected")) {
            btnCustomScheme.innerHTML = el.target.innerHTML
        }
}

function closeCustomSelectWhenClickedOutside(el) {
    const dropdownCustomDimensions =dropDownCustom.getBoundingClientRect() 
    if(
                el.clientX < dropdownCustomDimensions.left || 
                el.clientX > dropdownCustomDimensions.right || 
                el.clientY < dropdownCustomDimensions.top || 
                el.clientY > dropdownCustomDimensions.bottom
            ) {
              optionsContainer.classList.add("hidden-display")
            }
}

function changeSchemeValueWhenClicked(el) {
    if(el.target.className === "option selected") {
        scheme = el.target.innerHTML.toLowerCase().replace(/\s+/g, '')
        return scheme
    }
}

function displayNumbers() {
    numberOfClrs.previousElementSibling.value = `${numberOfClrs.value} colors`
}

async function getColorsFromApi() {
    const response = await fetch(
        `https://www.thecolorapi.com/scheme?hex=${pickedClr.value.slice(1)}&mode=${scheme}&count=${numberOfClrs.value}`
    )
    const dataFromApi = await response.json()
    return dataFromApi
}

async function generateHTML(arrFromApi) {
    const colorsArr = await arrFromApi
    let HTML = " "
    colorsArr.colors.forEach((clr) => {
        const rgb = clr.rgb.value.match(/\d+/g).map(Number)
        const result = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255
        HTML += 
            `<div class="clr-card">
            <img class="img" src=${clr.image.bare} /> 
            <p class="img-name" style="color:${result > 0.5 ? "black" : "white"}"}> ${clr.hex.value} </p> 
            </div> `
    })
    return HTML
  }


function copyHexToClipboard(el) {
    const hexValue = el.target.nextElementSibling.innerHTML
    navigator.clipboard.writeText(`${hexValue}`)
    copiedToClipBoardText.innerHTML = `copied ${hexValue}`
    copiedToClipBoardText.style.display = 'block'
    setTimeout(() => copiedToClipBoardText.style.display = 'none', 3000)
}