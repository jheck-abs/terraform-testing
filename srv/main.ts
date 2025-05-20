import { Construct } from "constructs";
import { TerraformStack, TerraformIterator, Fn, App } from "cdktf";

// Providers
import { CloudfoundryProvider } from "../.gen/providers/cloudfoundry/provider";
import { BtpProvider } from "../.gen/providers/btp/provider";

// Data sources
import { DataBtpSubaccountEnvironmentInstance } from "../.gen/providers/btp/data-btp-subaccount-environment-instance";
import { DataBtpSubaccountEnvironmentInstances } from "../.gen/providers/btp/data-btp-subaccount-environment-instances";

export class MainStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const subaccountEnvInstances = new DataBtpSubaccountEnvironmentInstances(
      this,
      "data-subaccount-environment-instances",
      {
        subaccountId: "appsSubaccount.id",
      }
    );
    const instancesIterator = TerraformIterator.fromComplexList(
      subaccountEnvInstances.values,
      "id"
    );

    const appSubaccountCfEnvivronment: DataBtpSubaccountEnvironmentInstance =
      new DataBtpSubaccountEnvironmentInstance(
        this,
        "subaccount-environment-instance",
        {
          dependsOn: [subaccountEnvInstances],
          subaccountId: "appsSubaccount.id",
          id: Fn.element(
            instancesIterator.forExpressionForList(
              'val.id if val.environment_type == "cloudfoundry"'
            ),
            0
          ),
        }
      );

    new CloudfoundryProvider(this, "cloudfoundry-provider", {
      user: "btpDeploymentUser",
      password: "btpDeploymentUserSecret",
      origin: "btpDeploymentUserOrigin",
      apiUrl: Fn.lookup(
        Fn.jsondecode(appSubaccountCfEnvivronment.labels),
        "API Endpoint"
      ),
    });

    new BtpProvider(this, "btp-provider", {
      globalaccount: "globalAccountSubdomain",
      username: "btpDeploymentUser",
      password: "btpDeploymentUserSecret",
      idp: "btpDeploymentUserIdP",
    });
  }
}

const app = new App();
new MainStack(app, "MainStack");
app.synth();
