export const getPaginatedData = async (Modal, page, dataPerPage, query, select = "", populate = "") => {
    page = +page < 0 ? false : +page || 1;
    dataPerPage = +dataPerPage ? +dataPerPage : 5;
    if (!page) { return { data: false, message: "Need correct data!" } }
    try {
        const totalCounts = await Modal.find(query).countDocuments();
        if (!totalCounts) {
            return { data: [], message: "Sorry, there is not any data yet!" };
        }
        const data = await Modal
            .find(query)
            .skip((page - 1) * dataPerPage)
            .limit(dataPerPage)
            .populate(populate)
            .select(select)

        const previousPage = page - 1 ? page - 1 : null;
        const lastPage = Math.ceil(totalCounts / dataPerPage);
        const nextPage = page + 1 <= lastPage ? page + 1 : null;
        if (page > lastPage) { return { data: false, message: "Need correct data!" } }
        return { data, currentPage: page, firstPage: 1, lastPage, previousPage, nextPage }
    }
    catch (e) {
        return { data: false, message: "Something Went Wrong" };
    }
}