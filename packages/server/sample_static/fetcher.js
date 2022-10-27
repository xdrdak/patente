export async function post(endpoint, payload) {
    const data = await fetch(endpoint, {
        method: "post",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const json = await data.json();
    return json;
}
