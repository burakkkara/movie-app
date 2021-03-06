import React, {Component} from 'react';
import {deleteDirector, getAllDirectors} from "../../utils/DirectorUtils";
import FilterableTable from "../../commons/table/FilterableTable";
import {ACCESS_TOKEN} from "../../utils/Constants";
import LoadingIndicator from "../../commons/loading/LoadingIndicator";
import "./Directors.css";

export default class Directors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isLoading: true,
            isNotAdmin: true
        }
    }

    componentDidMount() {
        this.checkAccessToken();
        this.loadDirectors();
        this.setState({
            isNotAdmin: localStorage.getItem("userRole") !== "Admin"
        });
    }

    render() {
        this.checkAccessToken();
        if (this.state.isLoading) {
            return (<LoadingIndicator/>);
        }
        this.checkErrorStates();
        return (
            <div className="container border director-list-container">
                <div className="row">
                    <FilterableTable
                        data={this.state.data}
                        addButtonText={"Add Director"}
                        leftButtonText={"Update"}
                        rightButtonText={"Delete"}
                        isNotAdmin={this.state.isNotAdmin}
                        isInfo={false}
                        isMovieList={false}
                        addHandler={this.handleAddClick}
                        leftButtonHandler={this.handleUpdateClick}
                        rightButtonHandler={this.handleDeleteClick}
                        infoHandler={this.handleInfoClick}
                        {...this.props}
                    />
                </div>
            </div>
        );
    }

    checkAccessToken = () => {
        if (!localStorage.getItem(ACCESS_TOKEN)) {
            this.props.history.push({
                pathname: "/please-login",
                state: {
                    title: "Welcome",
                    info: "Please Login",
                    buttonText: "Login",
                    link: "/login"
                }
            });
        }
    };

    loadDirectors = () => {
        this.setState({
            isLoading: true
        });
        getAllDirectors()
            .then(response => {
                this.setState({
                    data: response,
                    isLoading: false
                }, () => {
                    console.log("inside get all directors"); // TODO delete
                    console.log(this.state.data);
                });
            })
    };

    checkErrorStates = () => {
        if (this.state.isBadRequest) {
            this.props.history.push({
                pathname: "/error",
                state: {
                    title: "400",
                    info: "Bad Request",
                    buttonText: "Go Back",
                    link: "/"
                }
            });
        } else if (this.state.isNotFound) {
            this.props.history.push({
                pathname: "/error",
                state: {
                    title: "404",
                    info: "The page you are looking for was not found",
                    buttonText: "Go Back",
                    link: "/"
                }
            });
        } else if (this.state.isServerError) {
            this.props.history.push({
                pathname: "/error",
                state: {
                    title: "500",
                    info: "Oops! Something went wrong",
                    buttonText: "Go Back",
                    link: "/"
                }
            });
        }
    };

    handleAddClick = () => {
        console.log("-----------director add------------");
        this.props.history.push({
            pathname: "/directors/add",
            state: {}
        });
    };

    handleUpdateClick = (directorID) => {
        console.log("-----------director update------------");
        this.props.history.push({
            pathname: "/directors/update/" + directorID,
            state: {id: directorID}
        });
    };

    handleDeleteClick = (directorID) => {
        console.log("-----------director delete------------");
        deleteDirector(directorID)
            .then((response) => {
                console.log("Deleted done in directors");
                this.loadDirectors();
            })
    };

    handleInfoClick = (directorID) => {
        console.log("-----------director info------------" + directorID);
        this.props.history.push({
            pathname: "/directors/" + directorID,
            state: {id: directorID}
        });
    };
}