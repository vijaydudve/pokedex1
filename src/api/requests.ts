const request = async (
    method: string,
    url: string,
    bodyData: any,
    headers: Record<string, string>,
    params: Record<string, string | number> | null,
    options: RequestInit = {}
) => {
    try {
        let requestURL = new URL(url);
        if (params) {
            Object.keys(params).forEach(key => {
                requestURL.searchParams.append(key, params[key].toString());
            });
        }
        const fetchOptions = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            ...options
        };
        if (bodyData) {
            fetchOptions.body = JSON.stringify(bodyData);
        }
        const response = await fetch(requestURL.toString(), fetchOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (err) {
        throw err;
    }
};

export const getRequest = (
    url: string, 
    params?: any, 
    headers?: Record<string, string>,
    options?: RequestInit
) => request('GET', url, null, headers || {}, params, options);