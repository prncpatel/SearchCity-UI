export const Table = ({ search, isLoading, data }) => {

    console.log(isLoading)
    return (
        <table className="table">
            <thead>
                {<tr>
                    <th>#</th>
                    <th>City</th>
                    <th>Country</th>
                </tr>}
            </thead>
            <tbody>
                {
                    !search && !isLoading && (
                        <tr>
                            <td colSpan="3" className="table-empty">Start Searching</td>
                        </tr>
                    )
                }
                {
                    isLoading && (
                        <tr>
                            <td colSpan="3" className="table-empty">Loading...</td>
                        </tr>
                    )}
                {
                    search && !isLoading && data.length === 0 && (
                        <tr>
                            <td colSpan="3" className="table-empty">No data found</td>
                        </tr>
                    )
                }
                {!isLoading && search.length > 0 && data.length > 0 && data.map((item, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.city}</td>
                        <td><img width="20px" src={`https://flagsapi.com/${item.countryCode}/flat/64.png`}></img></td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
