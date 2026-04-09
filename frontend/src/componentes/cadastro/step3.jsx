import React from "react";
import InputField from "../inputField";
import { isValidCPF, isValidCNPJ } from "../../utils/validators";

export default function Step3({ tipo, register, errors }) {
  return (
    // Certifique-se de que esse container ocupe a altura total do box de cadastro;
    // assim os campos serão centralizados verticalmente e horizontalmente.
    <div className="flex justify-center items-center h-3/4">
      {/* Este div envolve os campos sem forçar uma largura máxima – eles permanecem com seu tamanho original */}
      <div className="w-full space-y-3">
        {tipo === "Agricultor" && (
          <>
            <InputField
              label="CPF"
              name="cpf"
              register={register}
              errors={errors}
              mask="cpf"
              validate={{
                validate: isValidCPF,
              }}
            />
            <InputField
              label="Nome da propriedade"
              name="nomePropriedade"
              register={register}
              errors={errors}
            />
            <InputField
              label="Área cultivada (ha)"
              name="areaCultivada"
              register={register}
              errors={errors}
              type="number"
              validate={{
                validate: (value) =>
                  Number(value) > 0 || "A área cultivada deve ser maior que zero",
              }}
            />
            <InputField
              label="Grãos cultivados"
              name="graos"
              register={register}
              errors={errors}
            />
          </>
        )}

        {tipo === "Empresário" && (
          <>
            <InputField
              label="CPF"
              name="cpf"
              register={register}
              errors={errors}
              mask="cpf"
              validate={{
                validate: isValidCPF,
              }}
            />
            <InputField
              label="Nome do comércio"
              name="nomeComercio"
              register={register}
              errors={errors}
            />
            <InputField
              label="CNPJ"
              name="cnpj"
              register={register}
              errors={errors}
              mask="cnpj"
              validate={{
                validate: isValidCNPJ,
              }}
            />
            <InputField
              label="Grãos de interesse"
              name="graos"
              register={register}
              errors={errors}
            />
          </>
        )}

        {tipo === "Cooperativa" && (
          <>
            <InputField
              label="CNPJ"
              name="cnpj"
              register={register}
              errors={errors}
              mask="cnpj"
              validate={{
                validate: isValidCNPJ,
              }}
            />
            <InputField
              label="Nome da cooperativa"
              name="nomeCooperativa"
              register={register}
              errors={errors}
            />
            <InputField
              label="Área de atuação"
              name="areaAtuacao"
              register={register}
              errors={errors}
            />
          </>
        )}
      </div>
    </div>
  );
}
