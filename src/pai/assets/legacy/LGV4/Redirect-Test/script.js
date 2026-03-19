window.onload = async function() {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
        await sleep(2000);
        window.location.replace("about:blank");
    } catch (error) {
        console.error("Navigation failed:", error);
    }
}
