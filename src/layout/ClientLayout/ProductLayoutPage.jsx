import Breadcrumbs from "../../components/Breadcrumbs"

const ProductLayoutPage = ({breadcrumbItems, children}) => {
    return (
        <div>
            <Breadcrumbs items={breadcrumbItems} />
            <div style={{margin: "1rem 1.5rem"}}>
                {children}
            </div>
        </div>
    )
}

export default ProductLayoutPage