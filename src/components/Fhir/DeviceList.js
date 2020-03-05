import React            from "react"
import PropTypes        from "prop-types"
import { CODE_SYSTEMS } from "../../lib/constants"
import DeviceGrid             from "./DeviceGrid"
import { getCodeOrConcept } from "../../lib"

export default class DeviceList extends React.Component
{
    static propTypes = {
        resources: PropTypes.arrayOf(PropTypes.object)
    };

    render()
    {
        let recs   = this.props.resources || []
        let length = recs.length;
        return (
            <DeviceGrid
                rows={(recs || []).map(o => o.resource)}
                title={`${length} Device${length === 1 ? "" : "s"}`}
                cols={[
                    {
                        label: "Type",
                        render: o => {
                            let name   = "-";
                            let code   = "-";
                            let system = "";

                            if (o.type.coding) {
                                if (Array.isArray(o.type.coding) && o.type.coding.length) {
                                    let c = o.type.coding[0]

                                    system = c.system
                                    for (let key in CODE_SYSTEMS) {
                                        if (CODE_SYSTEMS[key].url === c.system) {
                                            system = `(${key})`;
                                            break;
                                        }
                                    }

                                    if (c.display) {
                                        name = c.display
                                    }
                                    if (c.code) {
                                        code = c.code
                                    }
                                }
                            }
                            return (
                                <div>
                                    <b>{ name }</b>
                                    <small className="text-muted pull-right">
                                        { code } {system}
                                    </small>
                                </div>
                            )
                        }
                    },
                    {
                        label: <div className="text-center">Device Status</div>,
                        render: o => <div className="text-center">{ getCodeOrConcept(o.status) }</div>
                    },
                    {
                        label : <div className="text-center">Status Reason</div>,
                        render: o => {
                            let reason   = "-";

                            if (o.statusReason) {
                                if (o.statusReason.code) {
                                    if (o.statusReason.code.text) {
                                        reason = o.statusReason.code.text;
                                    }
                                    if (Array.isArray(o.statusReason.code.coding) && o.statusReason.code.coding.length) {
                                        let c = o.statusReason.code.coding[0]

                                        if (c.display) {
                                            reason = c.display
                                        }
                                    }
                                }
                            }
                            return (
                                <div>
                                    { reason }
                                </div>
                            )
                        }
                    }
                ]}
            />
        )
    }
}