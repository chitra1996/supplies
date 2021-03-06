import React from "react";
import { Button } from "react-bootstrap";
import DataCard from "./DataCard";
import { EmptyState } from "./EmptyState";
import {  get_products } from "../services";
import { products_list_headers } from "../constants";
import AddEditProductsModal from "./AddEditProductsModal";
import { Loading } from "../Loading";

export default class ProductsListView extends React.Component {
  state = {
    products: [],
    loading: true,
    showModal: false,
  };

  getProducts = async () => {
    const supplier_id = sessionStorage.getItem("supplier_id");
    let res = await get_products(supplier_id);
    this.setState({
      products: res.data,
      loading: false,
    });
  };

  render_table_headers = () => {
    return products_list_headers.map((ins, index) => {
      const { label, flex } = ins;
      return (
        <div key={`th-${index}`} className="p-3-0" style={{ flex: flex }}>
          {label}
        </div>
      );
    });
  };

  componentDidMount = async () => {
    this.getProducts();
  };

  render() {
    const { products, loading, showModal } = this.state;
    if (loading) return <Loading/>;

    return (
      <div>
        {!!showModal && (
          <AddEditProductsModal
            refresh={this.getProducts}
            onHide={() => this.setState({ showModal: false })}
          />
        )}
        <div style={{ textAlign: "right" }}>
          <Button
            className="btn btn-sm btn-primary"
            onClick={() => this.setState({ showModal: true })}
          >
            + Add New
          </Button>
        </div>
        {products.length ? (
          <>
            <div className="display-flex table-header">
              {this.render_table_headers()}
            </div>
            <div className="table-body">
              {products.map((obj, index) => (
                <DataCard
                  refresh={this.getProducts}
                  data={obj}
                  key={index}
                  index={index}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    );
  }
}
