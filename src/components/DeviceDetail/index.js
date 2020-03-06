import React                from "react"
import PropTypes            from "prop-types"
import { connect }          from "react-redux"
import $                    from "jquery"
import { Link }             from "react-router-dom"
import { queryBuilder }     from "../../redux/query"
import FHIR                 from "fhirclient"
import {
    getErrorMessage
} from "../../lib"
import "./DeviceDetail.less"

export class DeviceDetail extends React.Component
{
    static propTypes = {
        match       : PropTypes.object,
        settings    : PropTypes.object,
        selection   : PropTypes.object,
        query       : PropTypes.object
    }

    constructor(...args)
    {
        super(...args)
        this.query = queryBuilder.clone();
        this.state = {
            loading       : false,
            error         : null,
            patient       : {},
            hasNext       : false,
            resources     : {},
            selectedSubCat: "",
            bundle        : $.isEmptyObject(this.props.query.bundle) ?
                null :
                { ...this.props.query.bundle }
        };
    }

    componentDidMount()
    {
        this.fetch(this.props.match.params.id);
    }

    componentWillReceiveProps(newProps)
    {
        if (newProps.match.params.id !== this.props.match.params.id) {
            this.fetch(newProps.match.params.id);
        }
    }

    render()
    {
        return (
            <div className="page device-detail-page">
                <nav className="navbar bg-primary navbar-fixed-top">
                    <div className="container-fluid">
                        <div className="row navigator">
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-2">
                                <Link
                                    to={ `/patient/${this.state.index - 1}` }
                                    className="btn btn-primary btn-block"
                                    disabled={ this.state.index < 1 }
                                >
                                    <i className="fa fa-chevron-left"/>
                                    <b>Prev<span className="hidden-xs">ious Patient</span></b>
                                </Link>
                            </div>
                            <div className="col-xs-4 col-sm-4 col-md-6 col-lg-8 text-center">
                                <Link className="btn btn-block text-center" to="/">
                                    <span className="hidden-xs">Browse Patients</span>
                                    <span className="visible-xs">Browse</span>
                                </Link>
                            </div>
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-2 text-right">
                                <Link
                                    to={ `/patient/${this.state.index + 1}` }
                                    className="btn btn-primary btn-block"
                                    disabled={ !this.state.hasNext }
                                >
                                    <b>Next<span className="hidden-xs"> Patient</span></b>
                                    <i className="fa fa-chevron-right"/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
                <div classsName="container">
                    Foo
                </div>
            </div>
        )
    }

    fetch(id)
    {
        this.setState({ loading: true, id }, () => {
            this.fetchDevice(this.props.settings.server, id)
            .then(
                state => {
                    // console.log(state);
                    this.setState({
                        ...state,
                        error: null,
                        loading: false
                    })
                }
            )
            .catch(error => {
                this.setState({
                    loading   : false,
                    error
                })
            })
        })
    }

    fetchDevice(server, id)
    {
        return Promise.resolve({  ...this.state  })

        .then(state => {
            const client = FHIR.client({
                serverUrl: server.url
            });
            return client.request(`Device/${id}`).then(
                resource => {
                    state.resources.push(resource);
                    return state;
                }
            )
        })

        .then(
            state => Promise.resolve(state),
            error => Promise.reject(new Error(getErrorMessage(error)))
        )
    }
}

export default connect(state => state)(DeviceDetail)