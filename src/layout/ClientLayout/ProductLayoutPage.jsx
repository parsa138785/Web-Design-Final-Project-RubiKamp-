import PropTypes from 'prop-types';
import ClientLayout from './ClientLayout';

const ProductLayoutPage = ({ breadcrumbItems, children }) => {
    return (
        <ClientLayout breadcrumbItems={breadcrumbItems}>
            {children}
        </ClientLayout>
    );
};

ProductLayoutPage.propTypes = {
    breadcrumbItems: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            link: PropTypes.string
        })
    ),
    children: PropTypes.node.isRequired
};

export default ProductLayoutPage;