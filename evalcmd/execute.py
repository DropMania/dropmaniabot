import json
import base64
import sys

def eval_expression(input_string,context_as_scope={}):
    # Step 1
    allowed_names = {
        **context_as_scope,
        "pow": pow,
        "round": round,
        "divmod": divmod,
        "len": len,
        "str": str,
        "int": int,
        "float": float,
        "bool": bool,
        "list": list,
        "tuple": tuple,
        "set": set,
        "dict": dict,
        "sorted": sorted,
        "reversed": reversed,
        "enumerate": enumerate,
        "zip": zip,
        "range": range,
        "map": map,
        "filter": filter,
        "sum": sum,
        "abs": abs,
        "min": min,
        "max": max,
    }
    # Step 2
    code = compile(input_string, "<string>", "eval")
    # Step 3
    for name in code.co_names:
        if name not in allowed_names:
            # Step 4
            raise NameError(f"Use of {name} not allowed")
    return eval(code, {"__builtins__": {}}, {**allowed_names})

args = json.loads(base64.b64decode(sys.argv[1]).decode('utf-8'))
print(eval_expression(args['code'], args['scope']))
