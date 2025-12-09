window.onload = async function() {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
        await sleep(2000);
        //goes back to the parent test dir to run.html
        window.location.replace("../ui.html");
    } catch (error) {
        console.error("Navigation failed:", error);
    }
}
